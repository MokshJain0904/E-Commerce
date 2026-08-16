const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    guestEmail: { type: String },
    orderItems: [
      {
        id: { type: Number, required: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        image: { type: String, required: true },
      },
    ],
    shippingAddress: {
      fullName: { type: String },
      address: { type: String },
      city: { type: String },
      postalCode: { type: String },
      phone: { type: String },
    },
    paymentMethod: { type: String, required: true, default: 'UPI' },
    paymentResult: {
      transactionId: { type: String },
      status: { type: String, default: 'SUCCESS' },
      paidAt: { type: Date, default: Date.now },
    },
    totalPrice: { type: Number, required: true, default: 0.0 },
    isPaid: { type: Boolean, required: true, default: true },
    isDelivered: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
