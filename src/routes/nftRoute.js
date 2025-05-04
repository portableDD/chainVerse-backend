const express = require('express');
const router = express.Router();
const { getStudentNfts } = require('../controllers/nftController');
const { verifyCertificate, verifyNft } = require('../controllers/verificationController');
const { protect, restrictTo } = require('../middlewares/auth');

router.get('/students/:id/nfts', protect, restrictTo('student'), getStudentNfts);
router.get('/verify/certificate/:id', verifyCertificate);
router.get('/verify/nft/:tokenId', verifyNft);

module.exports = router;