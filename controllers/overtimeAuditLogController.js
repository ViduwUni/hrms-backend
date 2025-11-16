import OvertimeAuditLog from "../models/OvertimeAuditLog.js";

export const getOvertimeAuditLogs = async (req, res) => {
    try {
        const logs = await OvertimeAuditLog.find()
            .sort({ createdAt: -1 })
            .limit(500);

        res.json(logs);
    } catch (err) {
        console.error("Error fetching overtime audit logs:", err);
        res.status(500).json({ message: "Server error" });
    }
};
