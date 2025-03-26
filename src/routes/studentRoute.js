const express = require("express");
const { signUp } = require("./../controllers/studentController");

const studentRoute = new express.Router();

studentRoute.post("/create", signUp);

module.exports = studentRoute;
