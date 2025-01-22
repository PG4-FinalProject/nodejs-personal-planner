const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { StatusCodes } = require('http-status-codes');
dotenv.config();

const ensureAuthorization = (req, res, next) => {
  try {
    let receivedJWT = req.headers.authorization;

    if (receivedJWT) {
      let decodedJWT = jwt.verify(receivedJWT, process.env.PRIVATE_KEY);
      req.decodedJWT = decodedJWT;
      next();
    } else {
      throw new ReferenceError('jwt must be provided');
    }
  } catch (err) {
    if (err instanceof ReferenceError) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: '로그인을 해주세요',
      });
    }
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: '로그인 세션이 만료되었습니다. 다시 로그인 하세요',
      });
    }
    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: '잘못된 토큰입니다.',
      });
    }
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: 'ensureAuthorization에서 알 수 없는 오류 발생',
    });
  }
};

module.exports = ensureAuthorization;
