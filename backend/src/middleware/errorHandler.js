// Middleware xu ly loi TAP TRUNG.
// Express nhan dien day la error handler nho co DU 4 tham so (err, req, res, next).
// Phai duoc dang ky SAU CUNG, sau tat ca cac route.
function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';

  // Loi validate cua Mongoose (thieu field, sai enum, vuot maxlength...)
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map((e) => e.message).join('; ');
  }

  // ID sai dinh dang ObjectId
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID';
  }

  // Vi pham unique index (email trung)
  if (err.code === 11000) {
    statusCode = 409; // 409 Conflict
    message = 'Email is already in use';
  }

  // Chi log stack khi la loi that su cua server, tranh rac log
  if (statusCode === 500) console.error(err);

  res.status(statusCode).json({ success: false, message });
}

// Route khong ton tai -> 404, day sang errorHandler o tren
function notFound(req, res, next) {
  res.status(404).json({ success: false, message: `Cannot find ${req.originalUrl}` });
}

module.exports = { errorHandler, notFound };
