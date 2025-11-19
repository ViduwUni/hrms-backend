import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import overtimeRoutes from "./routes/overtimeRoutes.js";
import tripleOTRoutes from "./routes/tripleOTRoutes.js";
import downloadLogRoutes from "./routes/downloadLogRoutes.js";
import overtimeAuditLogRoute from "./routes/overtimeAuditLogRoute.js";
import logsRoutes from "./routes/logsRoutes.js";
// Settings
import overtimeReasonRoutes from "./routes/overtimeReasonRoutes.js";
import otRoutes from "./routes/otRoutes.js";

const app = express();
app.use(express.json());
app.use(cors());
connectDB();

// Artificial delay
// const delay = (ms) => (req, res, next) => {
//   setTimeout(next, ms);
// };
// app.use(delay(2000));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/overtime", overtimeRoutes);
app.use("/api/tripleot", tripleOTRoutes);
app.use("/api/downloadLog", downloadLogRoutes);
app.use("/api/overtime-audit", overtimeAuditLogRoute);
app.use("/api/logs", logsRoutes);
app.use("/api/settings/overtime-reasons", overtimeReasonRoutes);
app.use("/api/settings/overtime-configs", otRoutes);

app.get("/", (req, res) => res.send("API is running..."));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
