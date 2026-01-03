import mongoose from "mongoose";

const AbandonedCartNoteSchema = new mongoose.Schema(
  {
    abandonedCartId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    note: {
      type: String,
      required: true,
      trim: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.models.AbandonedCartNote ||
  mongoose.model("AbandonedCartNote", AbandonedCartNoteSchema);
