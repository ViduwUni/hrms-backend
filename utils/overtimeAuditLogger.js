import OvertimeAuditLog from "../models/OvertimeAuditLog.js";

export const logOvertimeAudit = async (
  action,
  overtimeId,
  performedBy,
  details = {}
) => {
  try {
    await OvertimeAuditLog.create({
      action,
      overtimeId,
      performedBy,
      details,
    });
    if (!performedBy) {
      console.error("AUDIT ERROR: performedBy missing");
      return;
    }
  } catch (error) {
    console.error("Failed to write overtime audit log:", error);
  }
};
