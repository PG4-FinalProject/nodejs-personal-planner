const express = require('express');
const router = express.Router();

const { getStatistics } = require('../controller/statisticController.js');

router.get('/', getStatistics);

module.exports = router;
