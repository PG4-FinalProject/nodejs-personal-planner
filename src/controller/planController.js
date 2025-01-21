const { StatusCodes } = require('http-status-codes');

const getPlans = (req, res) => {
  return res.status(StatusCodes.OK).end();
};

const addPlan = (req, res) => {
  return res.status(StatusCodes.CREATED).end();
};

const editPlan = (req, res) => {
  return res.status(StatusCodes.OK).json({
    message: '개별 플랜 수정 성공!',
  });
};

const deletePlan = (req, res) => {
  return res.status(StatusCodes.OK).end();
};

const notifyTodayPlan = (req, res) => {
  return res.status(StatusCodes.OK).end();
};

module.exports = {
  getPlans,
  addPlan,
  editPlan,
  deletePlan,
  notifyTodayPlan,
};
