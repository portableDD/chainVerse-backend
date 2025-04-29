const Course = require('../models/course');

// Controller to create a course
exports.createCourse = async (req, res) => {
	try {
		const { title, description } = req.body;

		// Basic validation
		if (!title || !description) {
			return res
				.status(400)
				.json({ message: 'Title and description are required.' });
		}

		const course = new Course({
			title,
			description,
			enrollments: [],
		});

		const savedCourse = await course.save();

		return res.status(201).json(savedCourse);
	} catch (error) {
		console.error('Error creating course:', error);
		return res.status(500).json({ message: 'Internal server error.' });
	}
};
