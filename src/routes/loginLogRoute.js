const express = require('express')
const {getUserLoginLogs, getAdminLogs } = require('../controllers/loginLogController')
const auth = require('../middlewares/auth');
const adminMiddleware = require('../middlewares/admin');

const router = express.Router()

router.get('/logins', auth.authenticate, getUserLoginLogs );
router.get('/logins/:userId', auth.authenticate, adminMiddleware.ensureAdmin, getAdminLogs )

module.exports = router;