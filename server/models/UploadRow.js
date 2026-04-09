const mongoose = require('mongoose');

const uploadRowSchema = new mongoose.Schema({
  upload_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Upload',
    required: true,
    index: true
  },
  date: { type: String },
  product: { type: String },
  category: { type: String },
  sales: { type: Number },
  units_sold: { type: Number },
  region: { type: String },
  customer_age: { type: Number }
});

module.exports = mongoose.model('UploadRow', uploadRowSchema);
