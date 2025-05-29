const express = require('express');
const router = express.Router();
const guestCartController = require('../controllers/guestCartController');

router.post('/guest/cart/create', guestCartController.createGuestCart);
router.get('/guest/cart/:cartKey', guestCartController.getGuestCart);
router.post('/guest/cart/:cartKey/add', guestCartController.addCourseToGuestCart);
router.delete('/guest/cart/:cartKey/remove', guestCartController.removeItemFromCart);
// router.delete('/guest/cart/:cartKey/clear', guestCartController.clearGuestCart);
router.put('/guest/cart/:cartKey', guestCartController.updateGuestCart);

// We will add other routes here soon

module.exports = router;
