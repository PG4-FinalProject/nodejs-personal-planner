const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');

const getAllNotifications = (req, res) => {
  decodedJWT = req.decodedJWT;

  let sql = `SELECT id, title, text, created_at FROM notification 
    WHERE user_id = ? AND is_checked = false`;
  let values = [decodedJWT.id];
  conn.query(sql, values, (err, result) => {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: '알림 목록 조회 실패!',
      });
    }

    return res.status(StatusCodes.OK).json({
      notifications: result,
    });
  });
};

const checkNotification = (req, res) => {
  const { id: notificationId } = req.params;

  let sql = `UPDATE notification SET is_checked = true
    WHERE id = ?`;
  let values = [notificationId];
  conn.query(sql, values, (err, result) => {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: '알림 체크 실패!',
      });
    }

    if (result.affectedRows) {
      return res.status(StatusCodes.OK).json({
        message: '알림 체크 성공!',
      });
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: '알림 체크 실패!',
      });
    }
  });
};

module.exports = {
  getAllNotifications,
  checkNotification,
};
