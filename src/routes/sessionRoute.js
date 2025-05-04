/**
 * @swagger
 * /sessions/book:
 *   post:
 *     summary: Book a private session
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               topic:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               tutorId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Session booked successfully
 */

const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/session.controller');
const {
  authMiddleware,
  roleMiddleware,
} = require('../middlewares/auth.middleware');

router.post(
  '/book',
  authMiddleware,
  roleMiddleware('student'),
  sessionController.book,
);
router.get(
  '/student',
  authMiddleware,
  roleMiddleware('student'),
  sessionController.getForStudent,
);
router.get(
  '/tutor',
  authMiddleware,
  roleMiddleware('tutor'),
  sessionController.getForTutor,
);
router.put(
  '/:id/accept',
  authMiddleware,
  roleMiddleware('tutor'),
  sessionController.accept,
);
router.put(
  '/:id/decline',
  authMiddleware,
  roleMiddleware('tutor'),
  sessionController.decline,
);
router.put('/:id/reschedule', authMiddleware, sessionController.reschedule);
router.delete(
  '/:id/cancel',
  authMiddleware,
  roleMiddleware('student'),
  sessionController.cancel,
);

module.exports = router;
