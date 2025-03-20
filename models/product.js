const mongoose = require('mongoose');
//define a product schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: Number,
  size: String,
  color: String,
  imageURL: String,
}, { timestamps: true });

//export mongo model via product key
module.exports = mongoose.model('Product', productSchema);
