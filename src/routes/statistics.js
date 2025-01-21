const express = require('express');
const router = express.Router();
router.use(express.json());

const { getStatistics } = require('../controller/statisticController.js');

router.get('/', getStatistics);

module.exports = router;
