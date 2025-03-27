const express = require("express");
const { signUp, signIn, deleteAccount, verifyEmail, forgotPassword, resetPassword, refreshToken } = require("./../controllers/authController");

const studentRoute = new express.Router();

studentRoute.post("/create", signUp);
studentRoute.post("/login", signIn);
studentRoute.post("/verify-email", verifyEmail);
studentRoute.post("/refresh-token", refreshToken);
studentRoute.post("/forgot-password", forgotPassword);
studentRoute.post("/reset-password", resetPassword);
studentRoute.delete("/delete/:id", deleteAccount);

module.exports = studentRoute;
