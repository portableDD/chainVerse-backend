const express = require("express");
const router = express.Router();
const auth = require("./../middlewares/auth");
const authorizeAdmin = require("./../middlewares/admin");
const RemovalRequestController = require("./../controllers/removalRequestController");

//ROUTE FOR USERS TO SUBMIT REQUEST
router.post(
  "/account/request-removal",
  auth,
  RemovalRequestController.createRequest
);

//ROUTE FOR ADMIN TO FETCH REQUEST
router.get(
  "/account/removal-requests",
  auth,
  authorizeAdmin,
  RemovalRequestController.getRequests
);

//ROUTE FOR ADMIN TO PROCESS A PARTICULAR REQUEST
router.patch(
  "/account/removal-requests/:requestId",
  auth,
  authorizeAdmin,
  RemovalRequestController.processRequest
);

module.exports = router;