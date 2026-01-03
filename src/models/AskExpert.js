import mongoose from "mongoose";

const AskExpertSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    message: { type: String, required: true },
    store: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.AskExpert ||
  mongoose.model("AskExpert", AskExpertSchema);
