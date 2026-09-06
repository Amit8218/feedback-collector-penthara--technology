import Feedback from '../models/Feedback.js';

const httpError = (status, message) => Object.assign(new Error(message), { status });
const escapeRegex = (str = '') => (typeof str === 'string' ? str.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&') : '');

export const getFeedbacks = async (req, res) => {
  const { search = '', date, sortBy = 'createdAt', order = 'desc' } = req.query;
  const filters = {};

  const queryTerm = typeof search === 'string' ? search.trim() : '';
  if (queryTerm) {
    const queryRegex = new RegExp(escapeRegex(queryTerm), 'i');
    filters.$or = [{ name: queryRegex }, { email: queryRegex }, { message: queryRegex }];
  }

  if (typeof date === 'string' && date) {
    const startOfDay = new Date(`${date}T00:00:00`);
    if (Number.isNaN(startOfDay.getTime())) {
      throw httpError(400, 'date must be a valid YYYY-MM-DD value');
    }
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(startOfDay);
    endOfDay.setHours(23, 59, 59, 999);
    filters.createdAt = { $gte: startOfDay, $lte: endOfDay };
  }

  const sortDirection = order === 'asc' ? 1 : -1;
  const sortKey = sortBy === 'name' ? 'name' : 'createdAt';

  const records = await Feedback.find(filters).sort({ [sortKey]: sortDirection }).lean();

  const data = records.map((record) => ({
    id: record._id.toString(),
    name: record.name,
    email: record.email,
    message: record.message,
    date: record.createdAt,
  }));

  res.json({ success: true, count: data.length, data });
};

export const createFeedback = async (req, res) => {
  const { name, email, message } = req.body || {};

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    throw httpError(400, 'name, email, and message are all required');
  }

  const record = await Feedback.create({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    message: message.trim(),
  });

  res.status(201).json({
    success: true,
    data: {
      id: record._id.toString(),
      name: record.name,
      email: record.email,
      message: record.message,
      date: record.createdAt,
    },
  });
};

export const deleteFeedback = async (req, res) => {
  const targetId = req.params.id;
  const deleted = await Feedback.findByIdAndDelete(targetId);

  if (!deleted) {
    throw httpError(404, 'Record not found');
  }

  res.json({ success: true, id: targetId });
};
