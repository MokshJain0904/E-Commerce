const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    rating: { type: Number, required: true, default: 4.5 },
    reviews: { type: Number, required: true, default: 0 },
    image: { type: String, required: true },
    description: { type: String, required: true },
    delivery: { type: String, default: 'Free Delivery' },
    inStock: { type: Boolean, default: true },
    badge: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
