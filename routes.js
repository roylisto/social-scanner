const express = require('express');
const router = express.Router();

const socialScannerController = require('./controllers/socialScannerController');

router.get('/social-scanner/search/:name/stream', socialScannerController.search);
// router.get('/social-scanner/search/:name/sync-json', socialScannerController.syncJson);
router.get('/social-scanner/upgrade', socialScannerController.upgrade);

module.exports = router;
