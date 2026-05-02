const express = require('express');
const router = express.Router();
const { saveSimulation, getHistory } = require('../controllers/simulationController');

router.post('/simulate', saveSimulation);
router.get('/history', getHistory);

module.exports = router;
