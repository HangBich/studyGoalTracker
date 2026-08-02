const Goal = require('../models/Goal');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/goals?subject=toan&status=dang-lam
// Loc o SERVER bang query param, khong tai het ve roi loc bang JS o client.
exports.listGoals = asyncHandler(async (req, res) => {
  const { subject, status } = req.query;

  // Moi query LUON bat dau bang userId lay tu token
  const filter = { userId: req.user._id };
  if (subject) filter.subject = subject;
  if (status) filter.status = status;

  const goals = await Goal.find(filter).sort({ deadline: 1, createdAt: -1 });

  res.status(200).json({ success: true, count: goals.length, data: goals });
});

// GET /api/goals/:id  -> xem chi tiet
exports.getGoal = asyncHandler(async (req, res) => {
  // QUAN TRONG: tim theo CA _id VA userId trong cung mot query.
  // KHONG dung findById roi moi so sanh chu so huu sau -> de quen nhanh nao do.
  const goal = await Goal.findOne({ _id: req.params.id, userId: req.user._id });
  if (!goal) throw new ApiError(404, 'Goal not found');

  res.status(200).json({ success: true, data: goal });
});

// POST /api/goals -> 201 Created (ma dung cho viec tao tai nguyen moi)
exports.createGoal = asyncHandler(async (req, res) => {
  const { title, description, subject, unit, targetValue, currentValue, deadline } = req.body;

  const goal = await Goal.create({
    userId: req.user._id, // gan chu so huu tu token, KHONG lay tu body
    title,
    description,
    subject,
    unit,
    targetValue,
    currentValue: currentValue || 0,
    deadline,
  });

  res.status(201).json({ success: true, data: goal });
});

// PUT /api/goals/:id -> thay the toan bo tai nguyen
exports.updateGoal = asyncHandler(async (req, res) => {
  const { title, description, subject, unit, targetValue, currentValue, status, deadline } = req.body;

  const goal = await Goal.findOne({ _id: req.params.id, userId: req.user._id });
  if (!goal) throw new ApiError(404, 'Goal not found');

  goal.title = title;
  goal.description = description || '';
  goal.subject = subject;
  goal.unit = unit;
  goal.targetValue = targetValue;
  if (currentValue !== undefined) goal.currentValue = currentValue;
  if (status) goal.status = status;
  goal.deadline = deadline;

  // Tu dong danh dau hoan thanh khi dat muc tieu
  if (goal.currentValue >= goal.targetValue) goal.status = 'hoan-thanh';

  await goal.save(); // .save() de chay validate cua schema
  res.status(200).json({ success: true, data: goal });
});

// PATCH /api/goals/:id/progress -> nut "+1" nhanh
// Dung PATCH chu khong phai PUT vi chi sua MOT phan tai nguyen,
// va de frontend khong phai gui lai ca object chi de tang mot so.
exports.updateProgress = asyncHandler(async (req, res) => {
  const { delta } = req.body;
  const step = Number(delta);

  if (!Number.isFinite(step) || step === 0) {
    throw new ApiError(400, 'delta must be a non-zero number');
  }

  const goal = await Goal.findOne({ _id: req.params.id, userId: req.user._id });
  if (!goal) throw new ApiError(404, 'Goal not found');

  // Kep gia tri trong khoang [0, targetValue]
  goal.currentValue = Math.max(0, Math.min(goal.targetValue, goal.currentValue + step));
  goal.status = goal.currentValue >= goal.targetValue ? 'hoan-thanh' : 'dang-lam';

  await goal.save();
  res.status(200).json({ success: true, data: goal });
});

// DELETE /api/goals/:id -> 204 No Content (khong kem body)
exports.deleteGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  if (!goal) throw new ApiError(404, 'Goal not found');

  res.status(204).send();
});
