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

// Apply protect to ALL routes declared below this line.
// This single line guarantees no endpoint can be left unprotected by mistake.
router.use(protect);

const goalValidation = [
  body('title').trim().notEmpty().withMessage('Goal title is required')
    .isLength({ max: 200 }).withMessage('Goal title must be at most 200 characters'),
  body('subject').isIn(Goal.SUBJECTS).withMessage('Invalid category'),
  body('unit').isIn(Goal.UNITS).withMessage('Invalid unit'),
  body('targetValue').isInt({ min: 1 }).withMessage('Target must be an integer greater than 0'),
  body('deadline').optional({ nullable: true, checkFalsy: true })
  .isISO8601().withMessage('Invalid deadline')
  .custom((value) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (new Date(value) < today) throw new Error('Deadline cannot be in the past');
    return true;
  })
    .isISO8601().withMessage('Invalid deadline'),
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