const mongoose = require('mongoose');

// Category list - used as the filter field required by the assignment
const SUBJECTS = ['coursework', 'project', 'programming', 'language', 'certification', 'reading', 'other'];
const UNITS = ['chuong', 'trang', 'bai', 'gio', 'buoi'];
const STATUSES = ['dang-lam', 'hoan-thanh', 'tam-dung'];

const goalSchema = new mongoose.Schema(
  {
    // Foreign key referencing User. ORAL EXAM: reference instead of embedding
    // because the number of goals per user is unbounded (MongoDB caps a
    // document at 16MB), and goals must be queried/filtered independently.
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Goal title is required'],
      trim: true,
      maxlength: [200, 'Goal title must be at most 200 characters'],
    },
    description: {
      type: String,
      default: '',
      maxlength: [1000, 'Description must be at most 1000 characters'],
    },
    // enum = validation at the schema layer (innermost of the 3 layers)
    subject: {
      type: String,
      required: true,
      enum: { values: SUBJECTS, message: 'Invalid category' },
      default: 'other',
    },
    unit: {
      type: String,
      required: true,
      enum: { values: UNITS, message: 'Invalid unit' },
      default: 'bai',
    },
    targetValue: {
      type: Number,
      required: [true, 'Target value is required'],
      min: [1, 'Target must be greater than 0'],
    },
    currentValue: {
      type: Number,
      default: 0,
      min: [0, 'Progress cannot be negative'],
    },
    status: {
      type: String,
      enum: { values: STATUSES, message: 'Invalid status' },
      default: 'dang-lam',
    },
    deadline: { type: Date },
  },
  {
    timestamps: true,
    // Expose virtual fields in JSON so the frontend receives "progress"
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ORAL EXAM: progress is NOT stored in the DB, it is derived on read.
// Storing it would create TWO sources of truth -> updating currentValue
// without updating progress would silently corrupt the data.
goalSchema.virtual('progress').get(function () {
  if (!this.targetValue) return 0;
  return Math.min(100, Math.round((this.currentValue / this.targetValue) * 100));
});

// Compound index serving the most frequent query:
// "get my goals, sorted by deadline"
goalSchema.index({ userId: 1, deadline: 1 });

module.exports = mongoose.model('Goal', goalSchema);
module.exports.SUBJECTS = SUBJECTS;
module.exports.UNITS = UNITS;
module.exports.STATUSES = STATUSES;