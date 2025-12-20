import mongoose from "mongoose";

const SettingSchema = new mongoose.Schema({
  key: String,
  value: String,
});

export default mongoose.models.Setting || mongoose.model("Setting", SettingSchema);
