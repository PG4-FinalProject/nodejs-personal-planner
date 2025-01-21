const express = require('express');
const router = express.Router();
router.use(express.json());

const {
  getPlans,
  addPlan,
  editPlan,
  deletePlan,
  notifyTodayPlan,
} = require('../controller/planController.js');

router.get('/', getPlans);
router.post('/', addPlan);
router.put('/:id', editPlan);
router.delete('/:id', deletePlan);
router.get('/notifications/today', notifyTodayPlan);

module.exports = router;
