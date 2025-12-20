
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    adminName: String,
    email: { type: String, unique: true },
    shopName: String,
    shopUrl: String,
    accessToken: String,
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);

