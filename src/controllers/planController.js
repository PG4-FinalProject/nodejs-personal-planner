const conn = require('../mariadb');
const asyncMariadb = require('mysql2/promise');
const { StatusCodes } = require('http-status-codes');

const getPlans = (req, res) => {
  const decodedJWT = req.decodedJWT;
  const { startDate, endDate } = req.query;

  let sql = `SELECT 
    selected_plan.id, title, detail, 
    start_time AS startTime, end_time AS endTime, color, 
    category.id AS categoryId, category.name AS categoryName
    FROM (SELECT * FROM plan WHERE user_id = ? 
    AND DATEDIFF(DATE(end_time), ?) >= 0
    AND DATEDIFF(DATE(start_time), ?) <= 0) 
    AS selected_plan LEFT JOIN category 
    ON category_id=category.id
    ORDER BY start_time`;
  let values = [decodedJWT.id, startDate, endDate];
  conn.query(sql, values, (err, result) => {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: '플랜 조회 실패!',
      });
    }

    return res.status(StatusCodes.OK).json({
      plans: result,
    });
  });
};

const addPlan = (req, res) => {
  const decodedJWT = req.decodedJWT;
  const { title, detail, startTime, endTime, categoryId } = req.body;

  let sql = `INSERT INTO plan 
    (title, detail, start_time, end_time, user_id, category_id)
    VALUES (?, ?, ?, ?, ?, ?)`;
  let values = [title, detail, startTime, endTime, decodedJWT.id, categoryId];
  conn.query(sql, values, (err, result) => {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: '플랜 생성 실패!',
      });
    }

    if (result.affectedRows) {
      return res.status(StatusCodes.CREATED).json({
        message: '플랜 생성 성공!',
      });
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: '플랜 생성 실패!',
      });
    }
  });
};

const editPlan = (req, res) => {
  const decodedJWT = req.decodedJWT;
  const { id: planId } = req.params;
  const { title, detail, startTime, endTime, categoryId } = req.body;

  let sql = `UPDATE plan 
    SET title = ?, detail = ?, start_time = ?, end_time = ?,
    category_id = ? WHERE id = ? AND user_id = ?`;
  let values = [
    title,
    detail,
    startTime,
    endTime,
    categoryId,
    decodedJWT.id,
    planId,
  ];
  conn.query(sql, values, (err, result) => {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: '플랜 수정 실패!',
      });
    }

    if (result.affectedRows) {
      return res.status(StatusCodes.OK).json({
        message: '플랜 수정 성공!',
      });
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: '플랜 수정 실패!',
      });
    }
  });
};

const deletePlan = (req, res) => {
  const decodedJWT = req.decodedJWT;
  const { id: planId } = req.params;

  let sql = `DELETE FROM plan WHERE id = ? AND user_id = ?`;
  let values = [decodedJWT.id, planId];
  conn.query(sql, values, (err, result) => {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: '플랜 삭제 실패!',
      });
    }

    if (result.affectedRows) {
      return res.status(StatusCodes.OK).json({
        message: '플랜 삭제 성공!',
      });
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: '플랜 삭제 실패!',
      });
    }
  });
};

const notifyTodayPlan = async (req, res) => {
  const asyncConn = await asyncMariadb.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PW,
    database: process.env.MYSQL_DB,
    dateStrings: true,
  });

  const decodedJWT = req.decodedJWT;
  const { currentTime } = req.body;

  try {
    let sql = `SELECT 
      id, title, detail, start_time, end_time, 
      category_id AS categoryId
      FROM plan WHERE user_id = ? 
      AND DATEDIFF(DATE(start_time), DATE(?)) = 0
      AND TIMEDIFF(start_time, ?) > 0
      ORDER BY start_time`;
    let values = [decodedJWT.id, currentTime, currentTime];
    const [todayPlans] = await asyncConn.execute(sql, values);

    sql = `SELECT
      id, title, detail, start_time, end_time, 
      category_id AS categoryId
      FROM plan WHERE user_id = ?
      AND TIMEDIFF(start_time, ?) <= 0
      AND TIMEDIFF(end_time, ?) >= 0`;
    const [inProgressPlans] = await asyncConn.execute(sql, values);

    return res.status(StatusCodes.OK).json({
      todayPlan: todayPlans[0],
      inProgressPlans,
    });
  } catch (e) {
    console.log(e);
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: '오늘의 우선 플랜 조회 실패!',
    });
  }
};

module.exports = {
  getPlans,
  addPlan,
  editPlan,
  deletePlan,
  notifyTodayPlan,
};
