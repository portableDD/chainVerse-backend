const AboutSection = require('../models/AboutSection');

// Create a new section
exports.createSection = async (req, res) => {
	try {
		// Check if section type already exists
		const existingSection = await AboutSection.findOne({
			sectionType: req.body.sectionType,
		});
		if (existingSection) {
			return res.status(409).json({
				success: false,
				message: `A section with type ${req.body.sectionType} already exists. Use update endpoint instead.`,
			});
		}

		const section = new AboutSection(req.body);
		await section.save();

		res.status(201).json({
			success: true,
			data: section,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

// Get all sections
exports.getAllSections = async (req, res) => {
	try {
		const sections = await AboutSection.find();
		res.status(200).json({
			success: true,
			count: sections.length,
			data: sections,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

// Get section by ID
exports.getSectionById = async (req, res) => {
	try {
		const section = await AboutSection.findById(req.params.id);

		if (!section) {
			return res.status(404).json({
				success: false,
				message: 'Section not found',
			});
		}

		res.status(200).json({
			success: true,
			data: section,
		});
	} catch (error) {
		if (error.kind === 'ObjectId') {
			return res.status(400).json({
				success: false,
				message: 'Invalid section ID format',
			});
		}

		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

// Update section
exports.updateSection = async (req, res) => {
	try {
		if (!req.body.sectionType) {
			return res.status(409).json({
				success: false,
				message: `A provide the section type you wish to update`,
			});
		}

		const section = await AboutSection.findOneAndUpdate(
			{ _id: req.params.id, sectionType: req.body.sectionType },
			{ ...req.body, updatedAt: Date.now() },
			{ new: true, runValidators: true }
		);

		if (!section) {
			return res.status(404).json({
				success: false,
				message: 'Section not found',
			});
		}

		res.status(200).json({
			success: true,
			data: section,
		});
	} catch (error) {
		if (error.kind === 'ObjectId') {
			return res.status(400).json({
				success: false,
				message: 'Invalid section ID format',
			});
		}

		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

// Delete section
exports.deleteSection = async (req, res) => {
	try {
		const section = await AboutSection.findByIdAndDelete(req.params.id);

		if (!section) {
			return res.status(404).json({
				success: false,
				message: 'Section not found',
			});
		}

		res.status(200).json({
			success: true,
			message: 'Section deleted successfully',
		});
	} catch (error) {
		if (error.kind === 'ObjectId') {
			return res.status(400).json({
				success: false,
				message: 'Invalid section ID format',
			});
		}

		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};
