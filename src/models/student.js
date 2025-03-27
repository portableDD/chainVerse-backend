const mongoose = require("mongoose");

const studentSchema = mongoose.Schema(
   {
      firstName: {
         type: String,
         trim: true,
         required: true,
      },
      lastName: {
         type: String,
         trim: true,
         required: true,
      },
      email: {
         type: String,
         trim: true,
         required: true,
         unique: true,
      },
      password: {
         type: String,
         trim: true,
         required: true,
         select: false,
      },
      forgotPasswordCode: {
         type: String,
         select: false,
      },
      forgotPasswordCodeValidation: {
         type: Number,
         select: false,
      },
      verified: {
         type: Boolean,
         default: false,
      },
      verificationCode: {
         type: String,
         select: false,
      },
      verificationCodeValidation: {
         type: Number,
         select: false,
      },
      refreshToken: {
         type: String,
         select: false,
      },
   },
   { timestamps: true }
);

const Student = mongoose.model("Student", studentSchema);
module.exports = Student;