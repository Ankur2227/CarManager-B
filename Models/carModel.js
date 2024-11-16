const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, required: true },
  description: { type: String, required: true },
  images: [{ type: String }], // Array of image URLs
  tags: [String], // Array of tags (car_type, company, dealer, etc.)
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Car', carSchema);
