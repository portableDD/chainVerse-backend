const Student = require("./../models/student");
const {
   signUpSchema,
   signInSchema,
   emailverifySchema
} = require("./../validators/studentValidator");
const { doHash, doCompare, doHmac, compareHmac } = require("./../utils/hashing");
const jwt = require("jsonwebtoken");
const {sendEmail} = require("../utils/sendMail");

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
      const info = await sendEmail(newStudent.email, verificationCode)

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
      newStudent.password = undefined;

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
     const student = await Student.findOne({ email })
     if (!student) {
        return res.status(404).json({
           status: 'fail',
           message: 'student not found'
        })
     }

     // check if student is already verified
     if (student.verified) {
        return res.status(401).json({
           status: 'fail',
           message: 'account already verified'
        })
     }

     // check and compare code to verify
     const isCodeValid = compareHmac(code, process.env.CRYPTO_KEY, student.verificationCode);
     if (!isCodeValid) {
        return res.status(400).json({
           status: 'fail',
           message: 'Invalid verification code'
        })
     }

     //   mark student as verified
     student.verified = true;
     student.verificationCode = undefined;
     await student.save();

     return res.status(200).json({
        status: 'success',
        message: 'Email verified successfully'
     })
     
  } catch (error) {
     return res.status(400).json({
        status: 'error',
        message: error.details ? error.details[0].message : error.message
   })
  }

   
}
