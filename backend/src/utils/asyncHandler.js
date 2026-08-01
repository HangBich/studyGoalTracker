// Boc controller async lai, tu dong bat loi va day sang errorHandler.
// Khong co no thi moi controller phai tu viet try/catch roi goi next(err).
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
