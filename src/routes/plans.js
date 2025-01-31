const ensureAuthorization = require('../middlewares/auth.js');
const express = require('express');
const router = express.Router();

const {
  getPlans,
  addPlan,
  editPlan,
  deletePlan,
  notifyTodayPlan,
} = require('../controllers/planController.js');

router.get('/', ensureAuthorization, getPlans);
router.post('/', ensureAuthorization, addPlan);
router.put('/:id', ensureAuthorization, editPlan);
router.delete('/:id', ensureAuthorization, deletePlan);
router.get('/notifications/today', ensureAuthorization, notifyTodayPlan);

module.exports = router;
