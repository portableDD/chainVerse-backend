const express = require("express");
const { signUp, signIn } = require("./../controllers/studentController");

const studentRoute = new express.Router();

studentRoute.post("/create", signUp);
studentRoute.post("/login", signIn);

module.exports = studentRoute;
