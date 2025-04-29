const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../../server');
const FinancialAid = require('../../models/financialAid');
const User = require('../../models/User');
const Course = require('../../models/course');
const jwt = require('jsonwebtoken');

describe('Financial Aid API', () => {
	let token;
	let userId;
	let courseId;

	beforeAll(async () => {
		// Connect to test database
		await mongoose.connect('mongodb://localhost:27017/chain');

		// Create test user
		const user = new User({
			name: 'Test User',
			email: 'test@example.com',
			password: 'password123',
		});
		await user.save();
		userId = user._id;

		// Create test course
		const course = new Course({
			title: 'Test Course',
			description: 'Test Description',
			price: 99.99,
		});
		await course.save();
		courseId = course._id;

		// Generate authentication token
		token = jwt.sign(
			{ id: user._id, email: user.email },
			'your_secure_jwt_secret_key_here',
			{ expiresIn: '7d' }
		);

		// req.set('x-auth-token', token);
	});

	afterAll(async () => {
		// Clean up test data
		await User.deleteMany({});
		await Course.deleteMany({});
		await FinancialAid.deleteMany({});
		await mongoose.connection.close();
	});

	describe('POST /financial-aid/apply', () => {
		it('should create a new financial aid application', async () => {
			const res = await request(app)
				.post('/financial-aid/apply')
				.set('x-auth-token', token)
				.send({
					courseId: courseId,
					reason:
						'I need financial assistance because I am currently unemployed and trying to improve my skills.',
					incomeStatus: 'Low',
				});

			expect(res.statusCode).toEqual(201);
			expect(res.body).toHaveProperty(
				'message',
				'Financial aid application submitted successfully'
			);
			expect(res.body).toHaveProperty('application');
			expect(res.body.application).toHaveProperty('status', 'Pending');
		});

		it('should not allow duplicate applications for the same course', async () => {
			const res = await request(app)
				.post('/financial-aid/apply')
				.set('x-auth-token', token)
				.send({
					courseId: courseId,
					reason: 'Another reason for financial aid.',
					incomeStatus: 'Low',
				});

			expect(res.statusCode).toEqual(400);
			expect(res.body).toHaveProperty(
				'message',
				'You already have an application for this course'
			);
		});

		it('should require authentication', async () => {
			const res = await request(app).post('/financial-aid/apply').send({
				courseId: courseId,
				reason: 'I need financial assistance.',
				incomeStatus: 'Low',
			});

			expect(res.statusCode).toEqual(401);
		});
	});

	describe('GET /financial-aid/my-applications', () => {
		it("should return user's applications", async () => {
			const res = await request(app)
				.get('/financial-aid/my-applications')
				.set('x-auth-token', token);

			expect(res.statusCode).toEqual(200);
			expect(res.body).toHaveProperty('applications');
			expect(res.body.applications.length).toBeGreaterThan(0);
		});

		it('should filter applications by status', async () => {
			const res = await request(app)
				.get('/financial-aid/my-applications?status=Pending')
				.set('x-auth-token', token);

			expect(res.statusCode).toEqual(200);
			expect(res.body).toHaveProperty('applications');
			expect(res.body.applications.length).toBeGreaterThan(0);
			expect(res.body.applications[0].status).toEqual('Pending');
		});

		it('should require authentication', async () => {
			const res = await request(app).get('/financial-aid/my-applications');

			expect(res.statusCode).toEqual(401);
		});
	});
});
