// src/app/model/Review.ts
import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IReview extends Document {
  userId: string;
  turfId: string;
  rating: number;
  comment: string;
}

const ReviewSchema = new Schema<IReview>(
  {
    userId: { type: String, required: true },
    turfId: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

// ✅ Prevent OverwriteModelError
const Review = models.Review || model<IReview>("Review", ReviewSchema);

export default Review;
