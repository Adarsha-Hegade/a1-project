import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  image: { type: String },
  name: { type: String },
  productCode: { type: String, required: true, unique: true },
  size: { type: String, required: true },
  manufacturer: { type: String, required: true },
  stock: { type: Number, required: true, default: 0 },
  badStock: { type: Number, required: true, default: 0 },
  bookings: { type: Number, required: true, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

productSchema.virtual('availableStock').get(function() {
  return this.stock - this.badStock - this.bookings;
});

productSchema.set('toJSON', { virtuals: true });

export default mongoose.model('Product', productSchema);