import mongoose from "mongoose";

const overtimeSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    employeeNumber: { type: String, required: true },
    name: { type: String, required: true },
    shift: { type: String, enum: ["6:30am", "8:30am"], required: true },
    intime: { type: String, required: true },
    outtime: { type: String, required: true },
    reason: { type: String, required: false },
    normalot: { type: Number, default: 0 },
    doubleot: { type: Number, default: 0 },
    tripleot: { type: Number, default: 0 },
    night: { type: String, default: "No" },
    approvedot: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    date: { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Overtime", overtimeSchema);
