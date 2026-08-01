const mongoose = require('mongoose');

// Danh sach mon hoc - dung lam truong LOC theo yeu cau de bai
const SUBJECTS = ['toan', 'ly', 'hoa', 'tin', 'ngoai-ngu', 'chuyen-nganh', 'khac'];
const UNITS = ['chuong', 'trang', 'bai', 'gio', 'buoi'];
const STATUSES = ['dang-lam', 'hoan-thanh', 'tam-dung'];

const goalSchema = new mongoose.Schema(
  {
    // Khoa ngoai tro toi User. VAN DAP: dung reference thay vi embed vi
    // so goal cua 1 user tang khong gioi han (document MongoDB gioi han 16MB),
    // va can query/loc goal doc lap voi user.
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Ten muc tieu khong duoc de trong'],
      trim: true,
      maxlength: [200, 'Ten muc tieu toi da 200 ky tu'],
    },
    description: {
      type: String,
      default: '',
      maxlength: [1000, 'Mo ta toi da 1000 ky tu'],
    },
    // enum = lop validate o tang schema (lop trong cung trong 3 lop validate)
    subject: {
      type: String,
      required: true,
      enum: { values: SUBJECTS, message: 'Mon hoc khong hop le' },
      default: 'khac',
    },
    unit: {
      type: String,
      required: true,
      enum: { values: UNITS, message: 'Don vi khong hop le' },
      default: 'bai',
    },
    targetValue: {
      type: Number,
      required: [true, 'Muc tieu khong duoc de trong'],
      min: [1, 'Muc tieu phai lon hon 0'],
    },
    currentValue: {
      type: Number,
      default: 0,
      min: [0, 'Tien do khong duoc am'],
    },
    status: {
      type: String,
      enum: { values: STATUSES, message: 'Trang thai khong hop le' },
      default: 'dang-lam',
    },
    deadline: { type: Date },
  },
  {
    timestamps: true,
    // Bat virtual field khi chuyen sang JSON de frontend nhan duoc "progress"
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// VAN DAP: progress KHONG luu trong DB, tinh khi can.
// Luu no xuong DB tao ra HAI nguon su that -> sua currentValue ma quen
// cap nhat progress la du lieu sai ngay. Du lieu suy ra duoc thi khong luu.
goalSchema.virtual('progress').get(function () {
  if (!this.targetValue) return 0;
  return Math.min(100, Math.round((this.currentValue / this.targetValue) * 100));
});

// Index ghep phuc vu dung cau query hay dung nhat:
// "lay goal cua toi, sap xep theo han"
goalSchema.index({ userId: 1, deadline: 1 });

module.exports = mongoose.model('Goal', goalSchema);
module.exports.SUBJECTS = SUBJECTS;
module.exports.UNITS = UNITS;
module.exports.STATUSES = STATUSES;
