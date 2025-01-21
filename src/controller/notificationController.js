const { StatusCodes } = require('http-status-codes');

const getAllNotifications = (req, res) => {
  return res.status(StatusCodes.OK).end();
};

const checkNotification = (req, res) => {
  return res.status(StatusCodes.OK).json({
    message: '알림 확인 완료!',
  });
};

module.exports = {
  getAllNotifications,
  checkNotification,
};
