const express = require("express");
const { signUp, signIn, deleteAccount } = require("./../controllers/studentController");

const studentRoute = new express.Router();

studentRoute.post("/create", signUp);
studentRoute.post("/login", signIn);
studentRoute.delete("/delete/:id", deleteAccount);

module.exports = studentRoute;
