const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

// Middleware xac thuc. Dat TRUOC controller trong chuoi middleware,
// nen controller luon duoc dam bao la da co req.user.
const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || '';

  if (!header.startsWith('Bearer ')) {
    // 401 = "may la ai?" (chua xac thuc)
    throw new ApiError(401, 'Chua dang nhap');
  }

  const token = header.split(' ')[1];

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    if (err.name === 'TokenExpiredError') throw new ApiError(401, 'Phien dang nhap da het han');
    throw new ApiError(401, 'Token khong hop le');
  }

  const user = await User.findById(decoded.id);
  if (!user) throw new ApiError(401, 'Tai khoan khong ton tai');

  // DIEM QUAN TRONG NHAT CUA CA DO AN:
  // userId lay tu payload cua token da duoc ky, KHONG lay tu body/query/params.
  // Client khong the tu khai minh la ai -> chan lo hong IDOR.
  req.user = user;
  next();
});

module.exports = protect;
