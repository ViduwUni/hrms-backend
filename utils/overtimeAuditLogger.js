import OvertimeAuditLog from "../models/OvertimeAuditLog.js";

export const logOvertimeAudit = async (action, overtimeId, performedBy, details = {}) => {
    try {
        await OvertimeAuditLog.create({
            action,
            overtimeId,
            performedBy,
            details,
        });
    } catch (error) {
        console.error("Failed to write overtime audit log:", error);
    }
};
