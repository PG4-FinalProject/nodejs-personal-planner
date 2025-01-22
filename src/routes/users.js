const express = require('express');
const router = express.Router();

const {
  getUser,
  join,
  login,
  editUser,
} = require('../controller/userController.js');

router.get('/', getUser);
router.post('/join', join);
router.post('/login', login);
router.put('/edit', editUser);

module.exports = router;
