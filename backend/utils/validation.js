const { body } = require('express-validator');

const registerValidation = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required'),

  body('usn')
    .trim()
    .notEmpty()
    .withMessage('USN is required'),

  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),

  body('phone')
    .isLength({ min: 10, max: 10 })
    .withMessage('Phone number must be 10 digits')
    .matches(/^[0-9]+$/)
    .withMessage('Phone number must contain only digits'),

  body('branch')
    .notEmpty()
    .withMessage('Branch is required'),

  body('section')
    .notEmpty()
    .withMessage('Section is required'),

  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

module.exports = { registerValidation, loginValidation };
