import mongoose from 'mongoose';

const OTPSessionSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
  },
  logId: {
    type: String,
    required: true,
    unique: true,
  },
  otp: {
    type: String,
    required: false, // Not stored for security
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  attempts: {
    type: Number,
    default: 0,
  },
  maxAttempts: {
    type: Number,
    default: 5,
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    index: { expireAfterSeconds: 0 }, // Auto-delete after expiry
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  purpose: {
    type: String,
    enum: ['signup', 'signin', 'password-reset', 'phone-verification'],
    default: 'signin',
  },
  metadata: {
    type: Object,
    required: false,
  },
}, {
  timestamps: true,
});

export default mongoose.models.OTPSession || mongoose.model('OTPSession', OTPSessionSchema);
