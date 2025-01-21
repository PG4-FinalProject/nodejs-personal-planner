const conn = require('../mariadb');
const crypto = require('crypto');
const { StatusCodes } = require('http-status-codes');

const getUser = (req, res) => {
  return res.status(StatusCodes.OK).end();
};

const join = (req, res) => {
  const { name, email, password } = req.body;

  const salt = crypto.randomBytes(10).toString('base64');
  const hashPassword = crypto
    .pbkdf2Sync(password, salt, 10000, 10, 'sha512')
    .toString('base64');

  let sql = `INSERT INTO pp_user (name, email, password, salt) VALUES (?, ?, ?, ?)`;
  let values = [name, email, hashPassword, salt];
  conn.query(sql, values, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    if (result.affectedRows) {
      return res.status(StatusCodes.CREATED).json(result);
    } else {
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
  });
};

const login = (req, res) => {
  return res.status(StatusCodes.OK).end();
};

const editUser = (req, res) => {
  return res.status(StatusCodes.OK).json({
    message: '유저 정보 수정 성공!',
  });
};

module.exports = {
  getUser,
  join,
  login,
  editUser,
};
