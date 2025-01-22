const express = require('express');
const router = express.Router();

const { getAllCategories } = require('../controller/categoryController.js');

router.get('/', getAllCategories);

module.exports = router;
