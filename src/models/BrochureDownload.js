import mongoose from "mongoose";

const BrochureDownloadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.BrochureDownload ||
  mongoose.model("BrochureDownload", BrochureDownloadSchema);
