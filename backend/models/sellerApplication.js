import mongoose from "mongoose";

const sellerApplicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true 
  },
  storeName: { type: String, trim: true },
  contactNumber: { type: String },
  storeAddress: { type: String },
  storeDescription: { type: String },
  storeBanner: { type: String },

  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
  }
}, { timestamps: true });

export default mongoose.model("SellerApplication", sellerApplicationSchema);
