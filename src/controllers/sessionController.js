const Session = require('../models/sessionModel');
const User = require('../models/User');

// POST /sessions/book
exports.book = async (req, res) => {
  try {
    const { topic, date, tutorId } = req.body;

    if (!topic || !date || !tutorId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const tutor = await User.findById(tutorId);
    if (!tutor || tutor.role !== 'tutor') {
      return res.status(404).json({ error: 'Tutor not found' });
    }

    const conflict = await Session.findOne({
      tutor: tutorId,
      date,
      status: { $in: ['pending', 'confirmed'] },
    });
    if (conflict) {
      return res
        .status(409)
        .json({ error: 'Tutor already booked at this time' });
    }

    const session = await Session.create({
      student: req.user._id,
      tutor: tutorId,
      topic,
      date,
    });

    return res.status(201).json({ session });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /sessions/student
exports.getForStudent = async (req, res) => {
  const sessions = await Session.find({ student: req.user._id }).populate(
    'tutor',
    'fullName email',
  );
  res.json(sessions);
};

// GET /sessions/tutor
exports.getForTutor = async (req, res) => {
  const sessions = await Session.find({ tutor: req.user._id }).populate(
    'student',
    'fullName email',
  );
  res.json(sessions);
};

// PUT /sessions/:id/accept
exports.accept = async (req, res) => {
  const session = await Session.findById(req.params.id);
  if (!session) return res.status(404).json({ error: 'Session not found' });

  if (String(session.tutor) !== req.user._id)
    return res.status(403).json({ error: 'Not your session' });

  session.status = 'confirmed';
  await session.save();
  res.json({ session });
};

// PUT /sessions/:id/decline
exports.decline = async (req, res) => {
  const session = await Session.findById(req.params.id);
  if (!session) return res.status(404).json({ error: 'Session not found' });

  if (String(session.tutor) !== req.user._id)
    return res.status(403).json({ error: 'Not your session' });

  session.status = 'declined';
  await session.save();
  res.json({ session });
};

// PUT /sessions/:id/reschedule
exports.reschedule = async (req, res) => {
  const { newDate } = req.body;
  const session = await Session.findById(req.params.id);
  if (!session) return res.status(404).json({ error: 'Session not found' });

  // Allow only involved users to request reschedule
  if (
    ![String(session.student), String(session.tutor)].includes(req.user._id)
  ) {
    return res.status(403).json({ error: 'You are not part of this session' });
  }

  session.rescheduleRequest = {
    date: newDate,
    requestedBy: req.user._id,
  };
  session.status = 'rescheduled';
  await session.save();
  res.json({ session });
};

// DELETE /sessions/:id/cancel
exports.cancel = async (req, res) => {
  const session = await Session.findById(req.params.id);
  if (!session) return res.status(404).json({ error: 'Session not found' });

  if (String(session.student) !== req.user._id)
    return res.status(403).json({ error: 'Not your session' });

  session.status = 'canceled';
  await session.save();
  res.json({ session });
};
