const express = require("express");
const auth = require("../middlewares/auth");
const {enable2FA, verify2FA, disable2FA} = require("./../controllers/Auth2FAController");

const router = express.Router();

router.post('/2fa/enable', auth.authenticate, enable2FA);
router.post('/2fa/verify', auth.authenticate, verify2FA);
router.post('/2fa/disable', auth.authenticate, disable2FA);

module.exports = router;