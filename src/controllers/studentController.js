const Student = require("./../models/student");
const {
   signUpSchema,
   signInSchema,
   emailverifySchema,
   forgotPasswordSchema,
   resetPasswordSchema,
} = require("./../validators/studentValidator");
const { doHash, doCompare, doHmac, compareHmac } = require("./../utils/hashing");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../utils/sendMail");

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
      const hashedPassword = await doHash(password, 12);
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

      return res.status(201).json({
         status: "success",
         message: "student registered successfully, please verify your email",
      });
   } catch (error) {
      return res.status(400).json({
         status: "fail",
         error: error.details ? error.details[0].message : error.message,
      });
   }
};

exports.signIn = async (req, res) => {
   const { email, password } = req.body;

   try {
      await signInSchema.validateAsync({ email, password });

      // check if student exist
      const existingStudent = await Student.findOne({ email }).select("+password");
      if (!existingStudent) {
         return res.status(404).json({
            status: "fail",
            message: "student not found",
         });
      }

      // compare password
      const correctPassword = await doCompare(password, existingStudent.password);
      if (!correctPassword) {
         return res.status(401).json({
            status: "fail",
            message: "incorrect password",
         });
      }

      // check if student is verified
      if (!existingStudent.verified) {
         return res.status(403).json({
            status: "fail",
            message: "account not verified",
         });
      }

      // generate token
      const token = jwt.sign(
         {
            studentId: existingStudent._id,
            email: existingStudent.email,
            verified: existingStudent.verified,
         },
         process.env.JWT_SECRET,
         { expiresIn: "8h" }
      );
      //   update loggedIn status
      existingStudent.loggedIn = true;
      await existingStudent.save();

      // set cookie with token
      res.cookie("Authorization", "Bearer " + token, {
         expires: new Date(Date.now() + 8 * 3600000),
         httpOnly: process.env.NODE_ENV === "production",
         secure: process.env.NODE_ENV === "production",
      });

      return res.status(200).json({
         status: "success",
         message: "student logged in successfully",
         token,
      });
   } catch (error) {
      return res.status(401).json({
         status: "fail",
         error: error.details ? error.details[0].message : error.message,
      });
   }
};

exports.signOut = async (req, res) => {
   res.clearCookie("Authorization");
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
      return res.status(500).json({
         status: "error",
         message: error.message,
      });
   }
};

exports.verifyEmail = async (req, res) => {
   const { email, code } = req.body;

   try {
      await emailverifySchema.validateAsync({ email, code });

      // fetch student to see if student exist
      const student = await Student.findOne({ email }).select(
         "+verificationCode verificationCodeValidation"
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

      // check if reset password code is expired (valid for 15mins)
      const expireTime = 15 * 60 * 1000; //15mins in milliseconds
      if (Date.now() - student.verificationCodeValidation > expireTime) {
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
      return res.status(400).json({
         status: "error",
         message: error.details ? error.details[0].message : error.message,
      });
   }
};

exports.forgotPassword = async (req, res) => {
   const { email } = req.body;
   try {
      await forgotPasswordSchema.validateAsync({ email });

      // check if student exist
      const student = await Student.findOne({ email }).select("+forgotPasswordCode +forgotPasswordCodeValidation");
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
      student.forgotPassword = hashedPasswordCode;
      student.forgotPasswordValidation = Date.now();
      await student.save();
      console.log(student)

      return res.status(200).json({
         status: "success",
         message: "email sent successfully with password reset code",
      });
   } catch (error) {
      return res.status(400).json({
         status: "error",
         error: error.details ? error.details[0].message : error.message,
      });
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

      // check if reset password code is expired (valid for 15mins)
      const expireTime = 15 * 60 * 1000; //15mins in milliseconds
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
      return res.status(400).json({
         status: "error",
         error: error.details ? error.details[0].message : error.message,
      });
   }
};
