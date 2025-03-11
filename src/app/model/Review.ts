import mongoose, { Schema, Document } from "mongoose";

interface IReview extends Document {
    userId: mongoose.Schema.Types.ObjectId;  // Ensure userId is an ObjectId
    turfId: mongoose.Schema.Types.ObjectId;
    comment: string;
    rating: number;
}

const ReviewSchema = new Schema<IReview>({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to User model
    turfId: { type: mongoose.Schema.Types.ObjectId, ref: "Turf", required: true }, // Reference to Turf model
    comment: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 }
});

const Review = mongoose.model<IReview>("Review", ReviewSchema);

export default Review;
