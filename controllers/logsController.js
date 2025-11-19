import fs from "fs";
import path from "path";

// Process uploaded fingerprint logs file
export const processLogs = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    // Read uploaded file buffer
    const rawData = req.file.buffer.toString("utf-8");
    const lines = rawData.split("\n").filter(Boolean);

    // Parse and map logs
    const logs = lines.map((line) => {
      const parts = line.trim().split(/\s+/);
      const empId = parts[0];
      const date = parts[1];
      const time = parts[2];

      // Make a date object
      const [hour, min] = time.split(":").map(Number);
      const datetime = new Date(`${date} ${time}`);

      // 🔥 Determine IN or OUT:
      // 00:00–05:59 = OUT
      // otherwise = IN
      let type = "IN";
      if (hour >= 0 && hour < 6) {
        type = "OUT";
      }

      return { empId, date, time, datetime, type };
    });

    // Sort by EmpID then datetime
    logs.sort((a, b) => {
      if (a.empId !== b.empId) return a.empId - b.empId;
      return a.datetime - b.datetime;
    });

    // Generate CSV content (including IN/OUT)
    const csvContent = [
      "EmpID,Date,Time,Type",
      ...logs.map((l) => `${l.empId},${l.date},${l.time},${l.type}`),
    ].join("\n");

    res.json({ logs, csv: csvContent }); // Return logs and CSV text
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error processing file" });
  }
};
