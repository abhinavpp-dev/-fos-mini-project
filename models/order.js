const mongoose = require('mongoose');

// Schema for individual order items
const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  price: {
    type: Number,
  },
});

// Main order schema
const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      match: [/^\+?\d{10,15}$/, 'Phone number must be between 10 and 15 digits, with optional country code'], // Updated regex
    },
    paymentMethod: {
      type: String,
      enum: ['COD', 'Credit Card'],
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    discountAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ['Pending', 'Completed', 'Cancelled', 'Awaiting Payment', 'Paid'], // Added 'Paid'
      default: 'Pending',
    },
    paymentStatus: {
      type: String,
      enum: ['Paid', 'Unpaid'], // Tracks payment state
      default: 'Unpaid',
    },
    items: [orderItemSchema],
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Static method to validate order data before saving
orderSchema.statics.validateOrder = function (orderData) {
  if (!orderData.items || orderData.items.length === 0) {
    throw new Error('Order must contain at least one item.');
  }
};

// Middleware to validate order total before saving
orderSchema.pre('save', function (next) {
  if (this.totalAmount < this.discountAmount) {
    return next(new Error('Discount amount cannot exceed total amount.'));
  }
  next();
});

// Create and export the model
const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
