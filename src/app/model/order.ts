import mongoose, { Schema, Document } from "mongoose";

// Define Order Interface
export interface IOrder extends Document {
  user_id: mongoose.Types.ObjectId; 
  turf_id: mongoose.Types.ObjectId; 
  date: Date; 
  startTime: string; // Start time of booking (e.g., "10:00 AM")
  endTime: string; // End time of booking (e.g., "12:00 PM")
  price: number; 
  paymentStatus: "pending" | "completed" | "failed"; // Payment status
  transactionId?: string; // Transaction ID if payment is completed
  status: "confirmed" | "cancelled" | "pending"; 
  createdAt: Date; 
  updatedAt: Date; 
}

// Define Order Schema
const OrderSchema: Schema = new Schema<IOrder>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    turf_id: { type: Schema.Types.ObjectId, ref: "Turf", required: true },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    price: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    transactionId: { type: String },
    status: {
      type: String,
      enum: ["confirmed", "cancelled", "pending"],
      default: "pending",
    },
  },
  { timestamps: true } // Automatically adds createdAt & updatedAt
);

// Export Order Model
const Order = mongoose.models.Order||mongoose.model<IOrder>("Order", OrderSchema);
export default Order;
