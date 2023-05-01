const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true },
  discount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Discount",
    required: true,
  },
  expiresAt: { type: Date, required: true },
});

module.exports = mongoose.model("Coupon", couponSchema);
