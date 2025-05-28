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
const sessionController = require('../controllers/sessionController');
const {
  hasRole
} = require('../middlewares/auth');
const auth = require('../middlewares/auth');

router.post(
  '/book',
  auth.authenticate,
  hasRole('student'),
  sessionController.book,
);
router.get(
  '/student',
   auth.authenticate,
  hasRole('student'),
  sessionController.getForStudent,
);
router.get(
  '/tutor',
   auth.authenticate,
  hasRole('tutor'),
  sessionController.getForTutor,
);
router.put(
  '/:id/accept',
   auth.authenticate,
  hasRole('tutor'),
  sessionController.accept,
);
router.put(
  '/:id/decline',
   auth.authenticate,
  hasRole('tutor'),
  sessionController.decline,
);
router.put('/:id/reschedule',  auth.authenticate, sessionController.reschedule);
router.delete(
  '/:id/cancel',
   auth.authenticate,
  hasRole('student'),
  sessionController.cancel,
);

module.exports = router;
