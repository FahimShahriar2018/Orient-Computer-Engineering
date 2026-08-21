import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Product',
    },
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    qty: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    sku: {
      type: String,
    },
  },
  { _id: false }
);

const statusHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    note: {
      type: String,
      default: '',
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    orderItems: [orderItemSchema],
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String },
      division: { type: String, required: true },
      district: { type: String, required: true },
      address: { type: String, required: true },
      postalCode: { type: String },
    },
    deliveryMethod: {
      type: String,
      enum: ['standard_inside_dhaka', 'standard_outside_dhaka', 'express', 'store_pickup'],
      default: 'standard_inside_dhaka',
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ['COD', 'bkash', 'nagad', 'card'],
      default: 'COD',
    },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      phone_number: { type: String },
      transaction_id: { type: String },
    },
    itemsPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    discountPrice: {
      type: Number,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    orderStatus: {
      type: String,
      enum: ['Pending', 'Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
    trackingNumber: {
      type: String,
      unique: true,
    },
    statusHistory: [statusHistorySchema],
  },
  {
    timestamps: true,
  }
);

// Auto-generate tracking number and initial status history before saving
orderSchema.pre('save', function (next) {
  if (!this.trackingNumber) {
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    this.trackingNumber = `ORIENT-${new Date().getFullYear()}-${randomSuffix}`;
  }
  if (this.isNew && this.statusHistory.length === 0) {
    this.statusHistory.push({
      status: this.orderStatus || 'Pending',
      timestamp: new Date(),
      note: 'Order placed successfully by customer',
    });
  }
  next();
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
