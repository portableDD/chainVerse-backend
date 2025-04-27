const mongoose = require('mongoose');
const AboutSection = require('../../models/AboutSection');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

beforeAll(async () => {
	mongoServer = await MongoMemoryServer.create();
	await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
	await mongoose.disconnect();
	await mongoServer.stop();
});

beforeEach(async () => {
	await AboutSection.deleteMany({});
});

describe('AboutSection Model', () => {
	test('should create a new section successfully', async () => {
		const sectionData = {
			sectionType: 'about',
			title: 'About ChainVerse Academy',
			content:
				'<p>ChainVerse Academy is a leading blockchain education platform.</p>',
		};

		const section = new AboutSection(sectionData);
		const savedSection = await section.save();

		expect(savedSection._id).toBeDefined();
		expect(savedSection.sectionType).toBe(sectionData.sectionType);
		expect(savedSection.title).toBe(sectionData.title);
		expect(savedSection.content).toBe(sectionData.content);
		expect(savedSection.createdAt).toBeDefined();
		expect(savedSection.updatedAt).toBeDefined();
	});

	test('should fail when required fields are missing', async () => {
		const sectionWithoutType = new AboutSection({
			title: 'Test Title',
			content: 'Test Content',
		});

		let err;
		try {
			await sectionWithoutType.save();
		} catch (error) {
			err = error;
		}

		expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
		expect(err.errors.sectionType).toBeDefined();
	});

	test('should fail with invalid section type', async () => {
		const sectionWithInvalidType = new AboutSection({
			sectionType: 'invalid',
			title: 'Test Title',
			content: 'Test Content',
		});

		let err;
		try {
			await sectionWithInvalidType.save();
		} catch (error) {
			err = error;
		}

		expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
		expect(err.errors.sectionType).toBeDefined();
	});

	test('should not allow duplicate section types', async () => {
		// Create first section
		await new AboutSection({
			sectionType: 'vision',
			title: 'Our Vision',
			content: 'Our vision is to educate the world about blockchain.',
		}).save();

		const duplicateSection = new AboutSection({
			sectionType: 'vision',
			title: 'Vision Statement',
			content: 'Another vision statement.',
		});

		let err;
		try {
			await duplicateSection.save();
		} catch (error) {
			err = error;
		}

		expect(err).toBeDefined();

		// MongoDB duplicate key error code
		expect(err.code).toBe(11000);
	});
});
