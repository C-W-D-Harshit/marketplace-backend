const mongoose = require("mongoose");

const discountSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ["percentage", "fixed"], required: true },
  amount: { type: Number, required: true },
});

module.exports = mongoose.model("Discount", discountSchema);
