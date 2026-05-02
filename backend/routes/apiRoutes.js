const express = require('express');
const router = express.Router();
const multer = require('multer');
const apiController = require('../controllers/apiController');

const upload = multer({ dest: 'uploads/' });

router.post('/tender/upload', upload.single('document'), apiController.uploadTender);
router.post('/bidder/upload', upload.array('documents', 10), apiController.uploadBidder);
router.post('/bidder/override', apiController.overrideEvaluation);
router.get('/tenders', apiController.getTenders);
router.get('/bidders/:tenderId', apiController.getBiddersByTender);
router.get('/analytics', apiController.getAnalytics);
router.get('/audit', apiController.getAuditLogs);

module.exports = router;
