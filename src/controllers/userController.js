const conn = require('../mariadb');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');

const getUser = (req, res) => {
  const decodedJWT = req.decodedJWT;

  let sql = `SELECT id, name, email FROM pp_user 
    WHERE id = ?`;
  let values = [decodedJWT.id];
  conn.query(sql, values, (err, result) => {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: '프로필 조회 실패!',
      });
    }

    return res.status(StatusCodes.OK).json(result[0]);
  });
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
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: '회원가입 실패!',
      });
    }

    if (result.affectedRows) {
      return res.status(StatusCodes.CREATED).json({
        message: '회원가입 성공!',
      });
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: '회원가입 실패!',
      });
    }
  });
};

const login = (req, res) => {
  const { email, password } = req.body;

  let sql = `SELECT * FROM pp_user WHERE email = ?`;
  let values = [email];
  conn.query(sql, values, (err, result) => {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: '로그인 실패!',
      });
    }
    if (result.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: '로그인 실패!',
      });
    }

    const loginUser = result[0];
    const hashPassword = crypto
      .pbkdf2Sync(password, loginUser.salt, 10000, 10, 'sha512')
      .toString('base64');

    if (loginUser && loginUser.password === hashPassword) {
      const token = jwt.sign(
        {
          id: loginUser.id,
          name: loginUser.name,
          email: loginUser.email,
        },
        process.env.PRIVATE_KEY,
        {
          expiresIn: '30m',
          issuer: 'yschoi',
        },
      );

      res.cookie('token', token, {
        httpOnly: true,
      });

      return res.status(StatusCodes.OK).json({
        message: '로그인 성공!',
        token: token,
      });
    } else {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: '로그인 실패!',
      });
    }
  });
};

const editUser = (req, res) => {
  const decodedJWT = req.decodedJWT;
  const { name } = req.body;

  let sql = `UPDATE pp_user SET name = ? WHERE id = ?`;
  let values = [name, decodedJWT.id];
  conn.query(sql, values, (err, result) => {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: '프로필 수정 실패!',
      });
    }

    if (result.affectedRows) {
      return res.status(StatusCodes.OK).json({
        message: '프로필 수정 완료! 다시 로그인해주세요!',
      });
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: '프로필 수정 실패!',
      });
    }
  });
};

module.exports = {
  getUser,
  join,
  login,
  editUser,
};
