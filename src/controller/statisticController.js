const { StatusCodes } = require('http-status-codes');

const getStatistics = (req, res) => {
  return res.status(StatusCodes.OK).end();
};

module.exports = {
  getStatistics,
};
