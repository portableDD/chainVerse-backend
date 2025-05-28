const express = require('express');
const router = express.Router();
const { getStudentNfts } = require('../controllers/nftController');
const { verifyCertificate, verifyNft } = require('../controllers/verificationController');
const auth = require('../middlewares/auth');


router.get('/students/:id/nfts', auth.authenticate, getStudentNfts);
router.get('/verify/certificate/:id', verifyCertificate);
router.get('/verify/nft/:tokenId', verifyNft);

module.exports = router;