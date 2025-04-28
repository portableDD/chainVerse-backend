const FAQ = require('../models/faq.model');

exports.createFAQ = async (req, res) => {
    try {
        const { question, answer } = req.body;
        const faq = await FAQ.create({ question, answer });

        res.status(201).json({
            success: true,
            data: faq
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            success: false,
            msg: 'Server Error'
        });
    }
};

exports.getAllFAQs = async (req, res) => {
    try {
        const faqs = await FAQ.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: faqs.length,
            data: faqs
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            success: false,
            msg: 'Server Error'
        });
    }
};

exports.getFAQById = async (req, res) => {
    try {
        const faq = await FAQ.findById(req.params.id);

        if (!faq) {
            return res.status(404).json({
                success: false,
                msg: 'FAQ not found'
            });
        }

        res.status(200).json({
            success: true,
            data: faq
        });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                msg: 'FAQ not found'
            });
        }
        res.status(500).json({
            success: false,
            msg: 'Server Error'
        });
    }
};

exports.updateFAQ = async (req, res) => {
    try {
        const { question, answer } = req.body;
        const faq = await FAQ.findByIdAndUpdate(
            req.params.id,
            { question, answer },
            { new: true, runValidators: true }
        );

        if (!faq) {
            return res.status(404).json({
                success: false,
                msg: 'FAQ not found'
            });
        }

        res.status(200).json({
            success: true,
            data: faq
        });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                msg: 'FAQ not found'
            });
        }
        res.status(500).json({
            success: false,
            msg: 'Server Error'
        });
    }
};

exports.deleteFAQ = async (req, res) => {
    try {
        const faq = await FAQ.findByIdAndDelete(req.params.id);

        if (!faq) {
            return res.status(404).json({
                success: false,
                msg: 'FAQ not found'
            });
        }

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                msg: 'FAQ not found'
            });
        }
        res.status(500).json({
            success: false,
            msg: 'Server Error'
        });
    }
};