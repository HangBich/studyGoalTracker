const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const protect = require('../middleware/auth');
const Goal = require('../models/Goal');
const {
  listGoals,
  getGoal,
  createGoal,
  updateGoal,
  updateProgress,
  deleteGoal,
} = require('../controllers/goalController');

const router = express.Router();

// Ap dung protect cho TAT CA route ben duoi.
// Mot dong nay dam bao khong the quen bao ve mot endpoint nao.
router.use(protect);

const goalValidation = [
  body('title').trim().notEmpty().withMessage('Ten muc tieu khong duoc de trong')
    .isLength({ max: 200 }).withMessage('Ten muc tieu toi da 200 ky tu'),
  body('subject').isIn(Goal.SUBJECTS).withMessage('Mon hoc khong hop le'),
  body('unit').isIn(Goal.UNITS).withMessage('Don vi khong hop le'),
  body('targetValue').isInt({ min: 1 }).withMessage('Muc tieu phai la so nguyen lon hon 0'),
  body('deadline').optional({ nullable: true, checkFalsy: true })
    .isISO8601().withMessage('Han hoan thanh khong hop le'),
];

router.route('/')
  .get(listGoals)
  .post(goalValidation, validate, createGoal);

router.route('/:id')
  .get(getGoal)
  .put(goalValidation, validate, updateGoal)
  .delete(deleteGoal);

router.patch('/:id/progress', updateProgress);

module.exports = router;
