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

// revokedToken schema in order to implement refresh token rotation
const revokedTokenSchema = new mongoose.Schema({
   token: { type: String, required: true }, // Hashed refresh token
   studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
   expiresAt: { type: Date, required: true }, // For cleanup
});

exports.RevokedToken = mongoose.model("RevokedToken", revokedTokenSchema);
exports.Student = mongoose.model("Student", studentSchema);

