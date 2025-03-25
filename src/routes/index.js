const express = require('express');
const tutorRoutes = require('./tutorRoutes')

const router = express.Router();

router.use('/', tutorRoutes)

module.exports = router;