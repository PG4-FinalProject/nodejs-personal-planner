const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const ensureAuthorization = req => {
  try {
    let receivedJWT = req.headers.authorization;

    if (receivedJWT) {
      let decodedJWT = jwt.verify(receivedJWT, process.env.PRIVATE_KEY);
      return decodedJWT;
    } else {
      throw new ReferenceError('jwt must be provided');
    }
  } catch (err) {
    return err;
  }
};

module.exports = ensureAuthorization;
