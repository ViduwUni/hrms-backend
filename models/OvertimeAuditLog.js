import mongoose from "mongoose";

const overtimeAuditLogSchema = new mongoose.Schema(
    {
        action: { type: String, required: true },
        overtimeId: { type: mongoose.Schema.Types.ObjectId, ref: "Overtime" },
        performedBy: { type: String, required: true },
        details: { type: Object },
    },
    { timestamps: true }
);

export default mongoose.model("OvertimeAuditLog", overtimeAuditLogSchema);
