const conn = require('../mariadb');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const ensureAuthorization = require('../utils/auth');

const getUser = (req, res) => {
  const authorization = ensureAuthorization(req);

  if (authorization instanceof ReferenceError) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: '로그인을 해주세요',
    });
  }
  if (authorization instanceof jwt.JsonWebTokenError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: '잘못된 토큰입니다.',
    });
  }
  if (authorization instanceof jwt.TokenExpiredError) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: '로그인 세션이 만료되었습니다. 다시 로그인 하세요',
    });
  }

  let sql = `SELECT id, name, email FROM pp_user 
    WHERE id = ?`;
  let values = [authorization.id];
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
  let values = email;
  conn.query(sql, values, (err, result) => {
    if (err) {
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
          expiresIn: '10m',
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
