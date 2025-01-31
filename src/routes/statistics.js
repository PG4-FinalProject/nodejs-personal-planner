const ensureAuthorization = require('../middlewares/auth.js');
const express = require('express');
const router = express.Router();

const { getStatistics } = require('../controllers/statisticController.js');

router.get('/', ensureAuthorization, getStatistics);

module.exports = router;
