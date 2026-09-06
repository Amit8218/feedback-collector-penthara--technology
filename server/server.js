import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { getFeedbacks, createFeedback, deleteFeedback } from './controllers/feedbackController.js';

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 5000;
const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/feedback_collector';

mongoose
  .connect(mongoUri, { serverSelectionTimeoutMS: 4000 })
  .then((conn) => console.log(`[mongo] connected -> ${conn.connection.host}/${conn.connection.name}`))
  .catch((err) => console.error(`[mongo] connect failed: ${err.message}`));

mongoose.connection.on('disconnected', () => console.log('[mongo] disconnected'));

app.use(cors());
app.use(express.json());

app.get('/api/health', (_, res) => {
  res.status(200).json({ status: 'healthy', uptime: Math.floor(process.uptime()) });
});

app.route('/api/feedback')
  .get(getFeedbacks)
  .post(createFeedback);

app.delete('/api/feedback/:id', deleteFeedback);

app.use((req, res) => {
  res.status(404).json({ error: `Cannot ${req.method} ${req.originalUrl}` });
});

app.use((err, _req, res, _next) => {
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors || {}).map((item) => item.message);
    return res.status(400).json({ success: false, message: messages.join(', ') || 'Validation error' });
  }
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return res.status(400).json({ success: false, message: 'Invalid resource identifier format' });
  }
  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

const server = app.listen(port, () => console.log(`[feedback-api] running on :${port}`));
process.on('SIGINT', () => server.close(() => process.exit(0)));

export default app;
