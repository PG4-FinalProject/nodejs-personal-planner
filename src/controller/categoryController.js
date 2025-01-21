const { StatusCodes } = require('http-status-codes');

const getAllCategories = (req, res) => {
  return res.status(StatusCodes.OK).end();
};

module.exports = {
  getAllCategories,
};
