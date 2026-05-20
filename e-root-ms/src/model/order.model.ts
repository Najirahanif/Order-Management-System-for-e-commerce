import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: String,

    products: [
      {
        productId: String,
        name: String,
        qty: Number,
        price: Number,
      },
    ],

    status: {
      type: String,
      default: "PENDING",
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);