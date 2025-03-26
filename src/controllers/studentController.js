const  Student  = require("./../models/student");
const { signUpSchema } = require("./../validators/studentValidator");
const { doHash } = require("./../utils/hashing");

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
         data: {
            newStudent,
         },
      });
   } catch (error) {
      return res.status(400).json({
         status: "fail",
         error: error.details ? error.details[0].message : error.message,
      });
   }
};
