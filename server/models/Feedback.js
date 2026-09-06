import mongoose from 'mongoose';






const FeedbackSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'name required'],
      trim: true,
      maxlength: 120,
    },
    email: {
      type: String,
      required: [true, 'email required'],
      trim: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, 'invalid email address'],
    },
    message: {
      type: String,
      required: [true, 'message required'],
      trim: true,
      minlength: [10, 'message must have at least 10 chars'],
      maxlength: 3000,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

FeedbackSchema.index({ createdAt: -1 });
FeedbackSchema.index({ name: 1 });





export default mongoose.model('Feedback', FeedbackSchema);
