const mariadb = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

// DB와 연결 통로 생성
const connection = mariadb.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PW,
  database: process.env.MYSQL_DB,
  dateStrings: true,
});

module.exports = connection;
