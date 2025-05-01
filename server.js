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
const logins = require('./src/routes/loginLogRoute');
const removalRequestRoutes = require('./src/routes/accountRemovalRoute');
const faqRoutes = require('./src/routes/faqRoute');
const financialAidRoutes = require('./src/routes/financialAidRoute');
const courseRoutes = require('./src/routes/courseRoute');
const courseReportRoutes = require('./src/routes/courseReportRoutes');
const contactUsRoutes = require('./src/routes/contactMessageRoute');
const adminFinancialAidRoutes = require('./src/routes/adminFinancialAidRoutes'); // <-- Add this line
const nftRoutes = require('./src/routes/nftRoute');
const careerRoutes = require('./src/routes/careerRoutes');


const { initScheduler } = require('./src/services/reportScheduler');

const app = express();
const dbConnection = require("./src/config/database/connection");
const router = require("./src/routes/index");
const studyGroupRoutes = require("./src/routes/studyGroupRoutes");

dotEnv.config();
dbConnection();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan("dev"));

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Error handling middleware
app.use(handleMulterErrors);

// General API routes
app.use('/api', router);

// Feature routes
app.use('/organization', organizationRoutes);
app.use('/auth', auth2FA);
app.use('/auth', logins);
app.use('/admin', require('./src/routes/admin'));
app.use('/platform-info', require('./src/routes/platformInfo'));
app.use('/api/study-groups', studyGroupRoutes);
app.use('/admin/subscription', require('./src/routes/subscriptionPlanRoutes'));
app.use('/section', aboutSectionRoutes);
app.use('/api', removalRequestRoutes);
app.use('/reports', courseReportRoutes);
app.use('/settings/faqs', faqRoutes);
app.use('/financial-aid', financialAidRoutes);
app.use('/api', courseRoutes);
app.use('/api', contactUsRoutes);
app.use('/admin/financial-aid', adminFinancialAidRoutes);

app.use('/api', nftRoutes);
app.use('/api', careerRoutes);

// Root endpoint
app.get('/', (req, res) => {
	res.send('Welcome to ChainVerse Academy');
});

// 404 handler
app.use((req, res, next) => {
	const error = new Error("Not found");
	error.status = 404;
	next(error);
});

// Global error handler
app.use((error, req, res, next) => {
	res.status(error.status || 500).send({
		status: error.status || 500,
		message: error.message,
		body: {},
	});
});

// Initialize report scheduler
initScheduler();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});

module.exports = app;
