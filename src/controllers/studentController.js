const Student = require("./../models/student");
const { signUpSchema, signInSchema } = require("./../validators/studentValidator");
const { doHash, doCompare } = require("./../utils/hashing");
const { json } = require("body-parser");
const jwt = require("jsonwebtoken");

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
      if (existingStudent.verified === false) {
         return res.status(403).json({
            status: "fail",
            message: "you are not yet verified",
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
   res.clearCookie('Authorization');
   return res.status(200).json({
      status: 'success',
      message: 'student logged out'
   })
}