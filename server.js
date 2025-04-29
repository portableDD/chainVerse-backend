const express = require('express');
const dotEnv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const { handleMulterErrors } = require('./src/middlewares/errorHandler');
const organizationRoutes = require('./src/routes/organization');
const aboutSectionRoutes = require('./src/routes/aboutSectionRoutes');
const auth2FA = require('./src/routes/2factorRoute');
const removalRequestRoutes = require('./src/routes/accountRemovalRoute');
const financialAidRoutes = require('./src/routes/financialAidRoute');
const courseRoutes = require('./src/routes/courseRoute');
const contactUsRoutes = require('./src/routes/contactMessageRoute');

// const dotEnv = require("dotenv");
// const morgan = require("morgan");
// const cors = require("cors");
// const helmet = require("helmet");

const app = express();
const dbConnection = require('./src/config/database/connection');
const router = require('./src/routes/index');
const studyGroupRoutes = require('./src/routes/studyGroupRoutes');

dotEnv.config();

app.use(cors());
dbConnection();

// dotEnv.config();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan('dev'));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Error handling middleware
app.use(handleMulterErrors);

// Routes
app.use('/organization', organizationRoutes);
app.use('auth', auth2FA);

app.use('/admin', require('./src/routes/admin'));
app.use('/platform-info', require('./src/routes/platformInfo'));
app.use('/api/study-groups', studyGroupRoutes);
app.use('/admin/subscription', require('./src/routes/subscriptionPlanRoutes'));
app.use('/section', aboutSectionRoutes);
app.use('/api', removalRequestRoutes);
app.use('/financial-aid', financialAidRoutes);
app.use('/api', courseRoutes);
app.use('/api', contactUsRoutes);

app.get('/', (req, res) => {
	res.send('Welcome to ChainVerse Academy');
});

app.use('/api', router);

app.use((req, res, next) => {
	const error = new Error('Not found');
	error.status = 404;
	next(error);
});

app.use((error, req, res, next) => {
	res.status(error.status || 500).send({
		status: error.status || 500,
		message: error.message,
		body: {},
	});
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});

module.exports = app;