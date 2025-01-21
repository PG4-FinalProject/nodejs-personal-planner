const express = require('express');
const router = express.Router();
router.use(express.json());

const { getAllCategories } = require('../controller/categoryController.js');

router.get('/', getAllCategories);

module.exports = router;
