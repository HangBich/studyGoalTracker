const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

// Ky token, nhet userId vao payload.
// Chinh cai "id" nay se duoc authMiddleware doc ra o moi request sau do.
function signToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

// Chi tra ve cac truong an toan, KHONG bao gio tra password
function publicUser(user) {
  return { id: user._id, name: user.name, email: user.email };
}

// POST /api/auth/register -> 201 Created
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existed = await User.findOne({ email });
  if (existed) throw new ApiError(409, 'Email da duoc su dung');

  // Password duoc hash tu dong boi hook pre('save') trong model
  const user = await User.create({ name, email, password });

  res.status(201).json({
    success: true,
    token: signToken(user._id),
    user: publicUser(user),
  });
});

// POST /api/auth/login -> 200 OK
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Phai .select('+password') vi model dat select: false
  const user = await User.findOne({ email }).select('+password');

  // Bao loi CHUNG CHUNG, khong noi ro sai email hay sai mat khau.
  // Neu noi ro, ke tan cong co the do xem email nao ton tai (user enumeration).
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Email hoac mat khau khong dung');
  }

  res.status(200).json({
    success: true,
    token: signToken(user._id),
    user: publicUser(user),
  });
});

// GET /api/auth/me -> dung de khoi phuc phien khi user F5 trang
exports.getMe = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, user: publicUser(req.user) });
});
