const Session = require('../models/session.model');
const { sendEmail } = require('./email.service');

exports.book = async (req, res) => {
  const { tutorId, topic, sessionDate, reason } = req.body;

  // Assume user is injected by auth middleware
  const student = req.user;

  const exists = await Session.findOne({ tutor: tutorId, sessionDate });
  if (exists)
    return res
      .status(409)
      .json({ message: 'Tutor already booked at this time' });

  const session = await Session.create({
    student,
    tutor: tutorId,
    topic,
    sessionDate,
    reason,
  });
  await sendEmail(
    'tutor@example.com',
    'New Session Booking',
    `New booking: ${topic}`,
  );
  res.status(201).json(session);
};

exports.getForStudent = async (req, res) => {
  const sessions = await Session.find({ student: req.user._id }).populate(
    'tutor',
  );
  res.json(sessions);
};

exports.getForTutor = async (req, res) => {
  const sessions = await Session.find({ tutor: req.user._id }).populate(
    'student',
  );
  res.json(sessions);
};

exports.cancel = async (req, res) => {
  const session = await Session.findOne({
    _id: req.params.id,
    student: req.user._id,
  });
  if (!session) return res.status(404).json({ message: 'Not found' });
  session.status = 'canceled';
  await session.save();
  res.json(session);
};

exports.reschedule = async (req, res) => {
  const { newDate } = req.body;
  const session = await Session.findOne({
    _id: req.params.id,
    student: req.user._id,
  });
  if (!session) return res.status(404).json({ message: 'Not found' });
  session.rescheduledDate = newDate;
  session.status = 'pending';
  await session.save();
  res.json(session);
};

exports.accept = async (req, res) => {
  const session = await Session.findOne({
    _id: req.params.id,
    tutor: req.user._id,
  });
  if (!session) return res.status(404).json({ message: 'Not found' });
  session.status = 'confirmed';
  await session.save();
  res.json(session);
};

exports.decline = async (req, res) => {
  const session = await Session.findOne({
    _id: req.params.id,
    tutor: req.user._id,
  });
  if (!session) return res.status(404).json({ message: 'Not found' });
  session.status = 'canceled';
  await session.save();
  res.json(session);
};
