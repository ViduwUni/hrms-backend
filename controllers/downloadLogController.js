import DownloadLog from "../models/DownloadLog.js";

// Create a new log entry
export const addDownloadLog = async (req, res) => {
  try {
    const { userId, startDate, endDate } = req.body;

    console.log(req.body);

    if (!userId || !startDate || !endDate) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const log = await DownloadLog.create({ userId, startDate, endDate });
    res.status(201).json({ message: "Download log added", log });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add download log" });
  }
};

// Get all download logs (for audit/admin)
export const getDownloadLogs = async (req, res) => {
  try {
    const logs = await DownloadLog.find()
      .populate("userId", "username email")
      .sort({ downloadedAt: -1 });

    const mappedLogs = logs.map((log) => ({
      ...log._doc,
      user: log.userId,
    }));

    res.json(mappedLogs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch download logs" });
  }
};
