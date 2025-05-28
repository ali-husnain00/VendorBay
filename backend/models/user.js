import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      minlength: 3,
    },
    email: { type: String, unique: true, required: true, lowercase: true },
    password: { type: String, required: true },
    profilePic: { type: String, default: "" },
    role: { type: String, enum: ["user", "seller", "admin"], default: "user" },

    cart: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, default: 1 },
      },
    ],

    notifications: [
      {
        message: { type: String, required: true },
        seen: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
        type: {
          type: String,
          enum: ["application", "order", "admin"],
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
