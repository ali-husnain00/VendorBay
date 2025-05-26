import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    minlength: 3,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePic: {
    type: String,
    default: "",
  },
  role: {
    type: String,
    enum: ["user", "seller", "admin"],
    default: "user",
  },

  //Seller specific info 
  storeName: {
    type: String,
    trim: true,
  },
  contactNumber: {
    type: String,
  },
  storeAddress: {
    type: String,
  },
  storeDescription: {
    type: String,
  },
  storeBanner: {
    type: String, 
  },

  cart: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
}, { timestamps: true });

export default mongoose.model("User", userSchema);
