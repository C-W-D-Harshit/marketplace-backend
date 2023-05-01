const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      taxes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tax" }],
      discounts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Discount" }],
      variation: [{}],
    },
  ],
  subTotal: { type: Number, required: true },
  taxes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tax" }],
  discounts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Discount" }],
  coupons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Coupon" }],
  total: { type: Number, required: true },
  shippingAddress: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ShippingAddress",
    required: true,
  },
  billingAddress: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BillingAddress",
    required: true,
  },
  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Payment",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "processing", "shipped", "delivered"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
