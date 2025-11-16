import mongoose from "mongoose";

const downloadLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  downloadedAt: { type: Date, default: Date.now },
});

export default mongoose.model("DownloadLog", downloadLogSchema);
