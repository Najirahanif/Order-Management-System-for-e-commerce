import mongoose, { Schema, Document } from "mongoose";

export type PaymentStatus =
  | "PENDING"
  | "INITIATED"
  | "SUCCESS"
  | "FAILED";

export interface IPayment extends Document {
  orderId: string;
  userId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  clientSecret?: string;

  stripePaymentIntentId?: string;

  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "inr" },

    status: {
      type: String,
      enum: ["PENDING", "INITIATED", "SUCCESS", "FAILED"],
      default: "PENDING",
    },
    clientSecret: {
      type: String,
    },

    stripePaymentIntentId: { type: String },
  },
  { timestamps: true }
);

export const PaymentModel = mongoose.model<IPayment>(
  "Payment",
  PaymentSchema
);