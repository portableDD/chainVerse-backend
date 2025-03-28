const { Student, RevokedToken } = require("../models/student");
const {
   signUpSchema,
   signInSchema,
   emailverifySchema,
   forgotPasswordSchema,
   resetPasswordSchema,
} = require("../validators/authValidator");
const { doHash, doCompare, doHmac, compareHmac } = require("../utils/hashing");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../utils/sendMail");

const VERIFICATION_CODE_EXPIRY = 5 * 60 * 1000; //5m
const ACCESS_TOKEN_EXPIRY = 15 * 60 * 1000; //15m
const REFRESH_TOKEN_EXPIRY = 1 * 24 * 60 * 60 * 1000; //1d
const SALT_VALUE = 12;

exports.signUp = async (req, res) => {
   const { firstName, lastName, email, password } = req.body;
   try {
      await signUpSchema.validateAsync({ firstName, lastName, email, password });

      // check if user already exist
      const existingStudent = await Student.findOne({ email });
      if (existingStudent) {
         return res.status(400).json({
            status: "fail",
            message: "student already exist",
         });
      }

      // hash password
      const hashedPassword = await doHash(password, SALT_VALUE);
      // save student to the database
      const newStudent = await Student({
         firstName,
         lastName,
         email,
         password: hashedPassword,
      });

      // generate verfication code
      const verificationCode = Math.floor(Math.random() * 1e6).toString();
      // send verification to student email
      const info = await sendEmail(newStudent.email, verificationCode, "Account verification");

      if (!info) {
         return res.status(500).json({
            status: "error",
            message: "student registered successfully, failed to send verification code to email",
         });
      }

      const hashedVerificationCode = doHmac(verificationCode, process.env.CRYPTO_KEY);

      // Save the hashed verification code and timestamp to the student
      newStudent.verificationCode = hashedVerificationCode;
      newStudent.verificationCodeValidation = Date.now();
      await newStudent.save();
      console.log(`newStudent:${newStudent}`);

      return res.status(201).json({
         status: "success",
         message: "student registered successfully, please verify your email",
      });
   } catch (error) {
      const statusCode = error.details ? 400 : 500; // 400 for validation, 500 for server errors
      const message = error.details ? error.details[0].message : "Login failed";
      return res.status(statusCode).json({ status: "fail", message });
   }
};

exports.signIn = async (req, res) => {
   const { email, password } = req.body;
   try {
      await signInSchema.validateAsync({ email, password });
      // Check if student exists
      const existingStudent = await Student.findOne({ email }).select("+password");
      if (!existingStudent) {
         return res.status(401).json({
            status: "fail",
            message: "Invalid email or password",
         });
      }

      // Check if password is correct
      const correctPassword = await doCompare(password, existingStudent.password);
      if (!correctPassword) {
         return res.status(401).json({
            status: "fail",
            message: "Invalid email or password",
         });
      }
      // check if student is verified
      if (!existingStudent.verified) {
         return res.status(403).json({
            status: "fail",
            message: "account not verified",
         });
      }
      // generate access token and refresh token
      const accessToken = jwt.sign({ sub: existingStudent._id }, process.env.JWT_ACCESS_TOKEN, {
         expiresIn: "15m",
      });
      const refreshToken = jwt.sign({ sub: existingStudent._id }, process.env.JWT_REFRESH_TOKEN, {
         expiresIn: "24h",
      });
      // hash and save refresh token in DB
      const hashedRefreshToken = await doHash(refreshToken, SALT_VALUE);
      existingStudent.refreshToken = hashedRefreshToken;
      await existingStudent.save();
      // set cookie with token
      res.cookie("accessToken", accessToken, {
         maxAge: ACCESS_TOKEN_EXPIRY,
         sameSite: "lax", //  CSRF protection
         httpOnly: true,
         secure: process.env.NODE_ENV === "production",
      });
      res.cookie("refreshToken", refreshToken, {
         maxAge: REFRESH_TOKEN_EXPIRY,
         sameSite: "strict", //  CSRF protection
         httpOnly: true,
         secure: process.env.NODE_ENV === "production",
         path: "/refresh-token",
      });

      return res.status(200).json({
         status: "success",
         message: "Logged in",
      });
   } catch (error) {
      const statusCode = error.details ? 400 : 500; // 400 for validation, 500 for server errors
      const message = error.details ? error.details[0].message : error.message;
      return res.status(statusCode).json({ status: "fail", message });
   }
};

exports.signOut = async (req, res) => {
   res.clearCookie("accessToken");
   res.clearCookie("refreshToken");

   return res.status(200).json({
      status: "success",
      message: "student logged out",
   });
};

exports.deleteAccount = async (req, res) => {
   const { id } = req.params;

   try {
      const deletedStudent = await Student.findByIdAndDelete(id);

      if (!deletedStudent) {
         return res.status(405).json({
            status: "fail",
            message: "Student not found",
         });
      }

      return res.status(200).json({
         status: "success",
         message: "Student account deleted successfully",
      });
   } catch (error) {
      const statusCode = error.details ? 400 : 500; // 400 for validation, 500 for server errors
      const message = error.details ? error.details[0].message : error.message;
      return res.status(statusCode).json({ status: "fail", message });
   }
};

exports.verifyEmail = async (req, res) => {
   const { email, code } = req.body;

   try {
      await emailverifySchema.validateAsync({ email, code });

      // fetch student to see if student exist
      const student = await Student.findOne({ email }).select(
         "+verificationCode +verificationCodeValidation"
      );
      console.log(`student: ${student}`);
      if (!student) {
         return res.status(404).json({
            status: "fail",
            message: "student not found",
         });
      }

      // check if student is already verified
      if (student.verified) {
         return res.status(409).json({
            status: "fail",
            message: "account already verified",
         });
      }

      // check and compare code to verify
      const isCodeValid = compareHmac(code, process.env.CRYPTO_KEY, student.verificationCode);
      if (!isCodeValid) {
         return res.status(400).json({
            status: "fail",
            message: "Invalid verification code",
         });
      }
      // check if reset password code is expired (valid for 5mins)
      if (Date.now() - student.verificationCodeValidation > VERIFICATION_CODE_EXPIRY) {
         return res.status(400).json({
            status: "fail",
            message: "password reset code has expired",
         });
      }

      //   mark student as verified
      student.verified = true;
      student.verificationCode = undefined;
      student.verificationCodeValidation = undefined;
      await student.save();

      return res.status(200).json({
         status: "success",
         message: "Email verified successfully",
      });
   } catch (error) {
      const statusCode = error.details ? 400 : 500; // 400 for validation, 500 for server errors
      const message = error.details ? error.details[0].message : error.message;
      return res.status(statusCode).json({ status: "fail", message });
   }
};

exports.forgotPassword = async (req, res) => {
   const { email } = req.body;
   try {
      await forgotPasswordSchema.validateAsync({ email });

      // check if student exist
      const student = await Student.findOne({ email }).select(
         "+forgotPasswordCode +forgotPasswordCodeValidation"
      );
      if (!student) {
         return res.status(404).json({
            status: "fail",
            message: "student not found",
         });
      }

      // check if student account is already verified
      if (!student.verified) {
         return res.status(409).json({
            status: "fail",
            message: "account not yet verifed",
         });
      }

      // generate password reset code and send email
      const resetPasswordCode = Math.floor(Math.random() * 1e6).toString();
      const info = await sendEmail(email, resetPasswordCode, "Password Reset");
      if (!info) {
         return res.status(500).json({
            status: "fail",
            message: "server fail to send email, we are working on it",
         });
      }

      // hash the reset the password code
      const hashedPasswordCode = doHmac(resetPasswordCode, process.env.CRYPTO_KEY);

      // store and save the hashed password reset code
      student.forgotPasswordCode = hashedPasswordCode;
      student.forgotPasswordCodeValidation = Date.now();
      await student.save();
      console.log(student);

      return res.status(200).json({
         status: "success",
         message: "email sent successfully with password reset code",
      });
   } catch (error) {
      const statusCode = error.details ? 400 : 500; // 400 for validation, 500 for server errors
      const message = error.details ? error.details[0].message : error.message;
      return res.status(statusCode).json({ status: "fail", message });
   }
};

exports.resetPassword = async (req, res) => {
   const { email, password, code } = req.body;

   try {
      // input validation
      await resetPasswordSchema.validateAsync({ email, password, code });

      // check if student exist
      const student = await Student.findOne({ email }).select(
         "+forgotPasswordCode +password +forgotPasswordCodeValidation"
      );
      console.log(`student:${student}`);
      if (!student) {
         return res.status(404).json({
            status: "fail",
            message: "student not found",
         });
      }

      // check if student account is verified
      if (!student.verified) {
         console.log(`email:${student.email}, verified:${student.verified}`);
         return res.status(409).json({
            status: "fail",
            message: "account not yet verified",
         });
      }

      // check if reset password code is valid
      const isValidCode = compareHmac(code, process.env.CRYPTO_KEY, student.forgotPasswordCode);
      if (!isValidCode) {
         return res.status(409).json({
            status: "fail",
            message: "password reset code is invalid",
         });
      }

      // check if reset password code is expired (valid for 5mins)
      const expireTime = 5 * 60 * 1000; //5mins in milliseconds
      if (Date.now() - student.forgotPasswordCodeValidation > expireTime) {
         return res.status(400).json({
            status: "fail",
            message: "password reset code has expired",
         });
      }

      // hash the new password and update and save student
      const hashedPassword = await doHash(password, 12);
      student.password = hashedPassword;
      student.forgotPasswordCode = undefined;
      student.forgotPasswordCodeValidation = undefined;
      await student.save();

      return res.status(200).json({
         status: "success",
         message: "password updated successfully",
      });
   } catch (error) {
      const statusCode = error.details ? 400 : 500; // 400 for validation, 500 for server errors
      const message = error.details ? error.details[0].message : error.message;
      return res.status(statusCode).json({ status: "fail", message });
   }
};

exports.refreshToken = async (req, res) => {
   const { refreshToken } = req.body;
   if (!refreshToken) {
      return res.status(401).json({
         status: "fail",
         message: "refresh token not provided",
      });
   }
   try {
      // verify jwt
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN);
      const student = await Student.findById(decoded.sub).select('+refreshToken');
      if (!student || !student.refreshToken) {
         return res.status(401).json({
            status: 'fail',
            message: 'invalid or expired refresh token'
         })
      }
      // check if token is revoked
      const hashedRefreshToken = doHash(refreshToken, SALT_VALUE);
      const isRevoked = await RevokedToken.findOne({
         token: hashedRefreshToken,
         studentId: student._id
      })
      if (isRevoked) {
         return res.status(401).json({
            status: 'fail',
            message: 'refresh token revoked'
         })
      }
      // verify active token matches
      if (hashedRefreshToken !== student.refreshToken) {
         return res.status(401).json({
            status: 'fail',
            message: 'invalid or tampered refresh token'
         })
      }
      // generate new access and refresh token
      const newAccessToken = jwt.sign(
         { sub: student._d },
         process.env, JWT_ACCESS_TOKEN,
         {expiresIn: '24h'}
      );
      const newRefreshToken = jwt.sign(
         { sub: student._id },
         process.env.JWT_REFRESH_TOKEN,
         { expiresIn: '24h' }
      );
      // Blacklist old refresh token
      await RevokedToken.create({
         token: hashedRefreshToken,
         studentId: student._id,
         expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY)
      })
      // update active token
      const hashedNewRefreshToken = await doHash(newRefreshToken, SALT_VALUE)
      student.refreshToken = hashedNewRefreshToken;
      await student.save;
      // set cookies
      res.cookie(
         'accessToken',
         newAccessToken,
         {
            maxAge: ACCESS_TOKEN_EXPIRY,
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
         }
      );
      res.cookie(
         'refreshToken',
         newRefreshToken,
         {
            maxAge: REFRESH_TOKEN_EXPIRY,
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
            path: '/refresh-token'
         }
      );
      return res.status(200).json({
         status: 'success',
         message: 'token refreshed successfully'
      })
   } catch (error) {
      return res.status(500).json({
         status: "fail",
         message: `Invalid refresh token`,
      });
   }
};
