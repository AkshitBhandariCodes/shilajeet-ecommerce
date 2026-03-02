import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: false, // Optional for phone auth
  },
  role: {
    type: String,
    enum: ['admin', 'customer'],
    default: 'customer',
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  avatar: {
    type: String,
    required: false,
  },
  phone: {
    type: String,
    required: false,
    unique: false,
  },
  phoneVerified: {
    type: Boolean,
    default: false,
  },
  authMethod: {
    type: String,
    enum: ['email', 'phone'],
    default: 'email',
  },
  address: {
    type: String,
    required: false,
  },
  dateOfBirth: {
    type: Date,
    required: false,
  },
  signupDiscountUsed: {
    type: Boolean,
    default: false,
  },
  signupDiscountCode: {
    type: String,
    required: false,
  },
  firstOrderCompleted: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

export default mongoose.models.User || mongoose.model('User', UserSchema);