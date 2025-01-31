const ensureAuthorization = require('../middlewares/auth.js');
const express = require('express');
const router = express.Router();

const {
  getUser,
  join,
  login,
  editUser,
} = require('../controllers/userController.js');

router.get('/', ensureAuthorization, getUser);
router.post('/join', join);
router.post('/login', login);
router.put('/edit', ensureAuthorization, editUser);

module.exports = router;
