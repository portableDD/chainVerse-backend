const express = require("express");
const { signUp, signIn, deleteAccount, verifyEmail, forgotPassword, resetPassword } = require("./../controllers/studentController");

const studentRoute = new express.Router();

studentRoute.post("/create", signUp);
studentRoute.post("/login", signIn);
studentRoute.post("/verify-email", verifyEmail);
studentRoute.post("/forgot-password", forgotPassword);
studentRoute.post("/reset-password", resetPassword);
studentRoute.delete("/delete/:id", deleteAccount);

module.exports = studentRoute;
