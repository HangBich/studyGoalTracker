const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

// Gom ket qua cua express-validator lai, co loi thi nem ApiError 400.
// Day la LOP VALIDATE THU HAI (sau HTML5 o form, truoc enum o schema).
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const message = errors.array().map((e) => e.msg).join('; ');
    return next(new ApiError(400, message));
  }
  next();
}

module.exports = validate;
