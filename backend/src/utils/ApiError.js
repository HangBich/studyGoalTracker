// Lop loi tuy chinh, mang theo HTTP status code.
// Nho no, moi noi trong code chi can: throw new ApiError(404, '...')
// Viec dich loi thanh HTTP response duoc gom ve MOT cho duy nhat (errorHandler).
class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;
