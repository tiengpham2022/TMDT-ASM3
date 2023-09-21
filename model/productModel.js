const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
    },
    img1: {
      type: String,
      required: true,
    },
    img2: {
      type: String,
      // required: true,
    },
    img3: {
      type: String,
      // required: true,
    },
    img4: {
      type: String,
      // required: true,
    },
    long_desc: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    short_desc: {
      type: String,
      required: true,
    },
    count: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

let Product = mongoose.model("Product", productSchema);

module.exports = Product;
