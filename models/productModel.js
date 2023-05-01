const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 5000,
  },
  shortDescription: {
    type: String,
    required: true,
    trim: true,
    maxlength: 300,
  },
  sku: {
    type: String,
    required: true,
    unique: true,
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  price: {
    type: Number,
    required: true,
    min: 0,
    validate: {
      validator: function (val) {
        return Number.isInteger(val);
      },
      message: "Price must be an integer.",
    },
  },
  salePrice: {
    type: Number,
    min: 0,
    validate: {
      validator: function (val) {
        return Number.isInteger(val);
      },
      message: "Sale price must be an integer.",
    },
  },
  isOnSale: {
    type: Boolean,
    default: false,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    required: true,
  },
  attributes: [
    {
      name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50,
      },
      value: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
      },
    },
  ],
  variations: [
    {
      name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50,
      },
      sku: {
        type: String,
        required: true,
        unique: true,
      },
      price: {
        type: Number,
        required: true,
        min: 0,
        validate: {
          validator: function (val) {
            return Number.isInteger(val);
          },
          message: "Price must be an integer.",
        },
      },
      salePrice: {
        type: Number,
        min: 0,
        validate: {
          validator: function (val) {
            return Number.isInteger(val);
          },
          message: "Sale price must be an integer.",
        },
      },
      isOnSale: {
        type: Boolean,
        default: false,
      },
      stock: {
        type: Number,
        required: true,
        min: 0,
      },
      attributes: [
        {
          name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 50,
          },
          value: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
          },
        },
      ],
    },
  ],
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
    required: true,
  },
  ratings: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      text: {
        type: String,
      },
    },
  ],
  numOfRatings: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      text: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", productSchema);
