import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    employeeNumber: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    phone: { type: String, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("Employee", employeeSchema);
