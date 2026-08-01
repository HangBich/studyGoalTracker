const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const protect = require('../middleware/auth');
const { register, login, getMe } = require('../controllers/authController');

const router = express.Router();

router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Ten khong duoc de trong'),
    body('email').isEmail().withMessage('Email khong hop le').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Mat khau toi thieu 6 ky tu'),
  ],
  validate,
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Email khong hop le').normalizeEmail(),
    body('password').notEmpty().withMessage('Mat khau khong duoc de trong'),
  ],
  validate,
  login
);

router.get('/me', protect, getMe);

module.exports = router;
