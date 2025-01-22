const ensureAuthorization = require('../middlewares/auth.js');
const express = require('express');
const router = express.Router();

const {
  getAllNotifications,
  checkNotification,
} = require('../controller/notificationController.js');

router.get('/', ensureAuthorization, getAllNotifications);
router.put('/:id', ensureAuthorization, checkNotification);

module.exports = router;
