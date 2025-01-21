const express = require('express');
const router = express.Router();
router.use(express.json());

const {
  getAllNotifications,
  checkNotification,
} = require('../controller/notificationController.js');

router.get('/', getAllNotifications);
router.put('/:id', checkNotification);

module.exports = router;
