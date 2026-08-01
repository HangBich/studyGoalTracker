const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Ten khong duoc de trong'],
      trim: true,
      maxlength: [100, 'Ten toi da 100 ky tu'],
    },
    email: {
      type: String,
      required: [true, 'Email khong duoc de trong'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Email khong hop le'],
    },
    password: {
      type: String,
      required: [true, 'Mat khau khong duoc de trong'],
      minlength: [6, 'Mat khau toi thieu 6 ky tu'],
      // VAN DAP: select: false = moi query mac dinh KHONG tra ve password.
      // Muon lay phai .select('+password') thu cong (chi lam luc login).
      // Day la phong ve chong ro ri do so y, vi du res.json(user).
      select: false,
    },
  },
  { timestamps: true }
);

// Hash password TRUOC khi luu. Chay tu dong moi lan .save()
userSchema.pre('save', async function (next) {
  // Chi hash khi password thay doi, tranh hash lai hash cu khi update thong tin khac
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// So sanh mat khau nhap vao voi hash trong DB.
// bcrypt hash MOT CHIEU, khong giai ma nguoc duoc -> phai compare.
userSchema.methods.comparePassword = function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
