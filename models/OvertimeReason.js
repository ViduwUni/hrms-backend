import mongoose from "mongoose";

const OvertimeReasonSchema = new mongoose.Schema(
    {
        option: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        }
    },
    { timestamps: true }
);

export default mongoose.model("OvertimeReason", OvertimeReasonSchema);
