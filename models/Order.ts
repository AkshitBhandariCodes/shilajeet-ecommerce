import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  variant: {
    type: String,
    required: false,
  },
});

const AddressSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address1: {
    type: String,
    required: true,
  },
  address2: {
    type: String,
    required: false,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  zipCode: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
});

const PaymentSchema = new mongoose.Schema({
  mode: {
    type: String,
    enum: ['COD', 'Prepaid'],
    required: true,
  },
  method: {
    type: String,
    enum: ['Razorpay', 'Credit Card', 'Debit Card', 'UPI', 'Wallet'],
    required: false,
  },
  cardNumber: {
    type: String,
    required: false,
    // Store only last 4 digits for security
    set: (value: string) => value ? '**** **** **** ' + value.slice(-4) : undefined,
  },
  cardholderName: {
    type: String,
    required: false,
  },
  transactionId: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  },
});

const OrderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  idempotencyKey: {
    type: String,
    required: false,
    index: true,
  },
  items: [OrderItemSchema],
  shippingAddress: {
    type: AddressSchema,
    required: true,
  },
  billingAddress: {
    type: AddressSchema,
    required: false,
  },
  payment: {
    type: PaymentSchema,
    required: true,
  },
  subtotal: {
    type: Number,
    required: true,
  },
  tax: {
    type: Number,
    required: true,
  },
  shipping: {
    type: Number,
    default: 0,
  },
  couponCode: {
    type: String,
    required: false,
  },
  discountAmount: {
    type: Number,
    default: 0,
  },
  total: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  trackingNumber: {
    type: String,
    required: false,
  },
  shippingProvider: {
    type: String,
    enum: ['delhivery', 'shiprocket', 'other'],
    default: 'delhivery',
  },
  trackingStatus: {
    type: String,
    enum: ['pending', 'picked', 'in_transit', 'delivered', 'failed'],
    default: 'pending',
  },
  // Delhivery tracking data
  delhiveryData: {
    waybill: String,
    shipmentId: String,
    trackingUrl: String,
    expectedDeliveryDate: Date,
    expectedDeliveryDays: Number,
    currentStatus: String,
    lastUpdate: Date,
    scans: [{
      status: String,
      location: String,
      timestamp: Date,
      remarks: String,
    }],
  },
  // Shiprocket tracking data
  shiprocketData: {
    waybill: String,
    shipmentId: String,
    orderId: String,
    trackingUrl: String,
  },
  // Shipping stats
  shippingStats: {
    pickedDate: Date,
    inTransitDate: Date,
    deliveredDate: Date,
    attemptCount: Number,
    lastLocation: String,
    estimatedDelivery: Date,
  },
  notes: {
    type: String,
    required: false,
  },
}, {
  timestamps: true,
});

// Generate order number before saving
OrderSchema.pre('save', function(next) {
  if (!this.orderNumber) {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.orderNumber = `AG${timestamp.slice(-6)}${random}`;
  }
  next();
});

// Ensure orderNumber is always generated
OrderSchema.pre('validate', function(next) {
  if (!this.orderNumber) {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.orderNumber = `AG${timestamp.slice(-6)}${random}`;
  }
  next();
});

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);