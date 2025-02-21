import mongoose, { Schema, Document, Types } from "mongoose";

export interface ITurf extends Document {
    name: string;
    location: string;
    pricePerHour: number;
    size: string;
    surfaceType: string;
    amenities: string[];
    availability: { day: string; startTime: string; endTime: string }[];
    createdBy: Types.ObjectId; // Admin who created the turf
    images?: string[];
    createdAt: Date;
    updatedAt: Date;
}

const TurfSchema = new Schema<ITurf>(
    {
        name: { type: String, required: true, unique: true },
        location: { type: String, required: true, index: true }, // Indexed for better search performance
        pricePerHour: { type: Number, required: true },
        size: { type: String, required: true },
        surfaceType: { type: String, required: true },
        amenities: { type: [String], default: [] },
        availability: [
            {
                day: { type: String, required: true },
                startTime: { type: String, required: true },
                endTime: { type: String, required: true },
            },
        ],
        createdBy: { type: Schema.Types.ObjectId, ref: "Admin", required: true }, // Reference to Admin/User
        images: [{type:String}],
    },
    { timestamps: true }
);

const Turf = mongoose.models.Turf || mongoose.model<ITurf>("Turf", TurfSchema);
export default Turf;
