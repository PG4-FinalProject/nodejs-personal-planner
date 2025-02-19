const express = require('express');
const router = express.Router();

const { getAllCategories } = require('../controllers/categoryController.js');

router.get('/', getAllCategories);

module.exports = router;
