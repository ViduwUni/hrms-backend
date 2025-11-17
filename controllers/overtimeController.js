import Overtime from "../models/Overtime.js";
import Employee from "../models/Employee.js";
import { logOvertimeAudit } from "../utils/overtimeAuditLogger.js";
import ExcelJS from "exceljs";
import path from "path";
import fs from "fs";

// Add new overtime entry
export const addOvertime = async (req, res) => {
  try {
    const {
      employeeNumber,
      name,
      shift,
      intime,
      outtime,
      reason,
      normalot = 0,
      doubleot = 0,
      tripleot = 0,
      night = "no",
      status = "Pending",
      date,
    } = req.body;

    const employee = await Employee.findOne({ employeeNumber });
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });

    const newOvertime = new Overtime({
      employee: employee._id,
      employeeNumber,
      name: name || employee.name,
      shift,
      intime,
      outtime,
      reason,
      normalot,
      doubleot,
      tripleot,
      night: String(night).toLowerCase(),
      status,
      date,
    });

    await newOvertime.save();
    await logOvertimeAudit("CREATE", newOvertime._id, req.body.performedBy, {
      overtime: newOvertime,
    });
    res
      .status(201)
      .json({ message: "Overtime entry added successfully", newOvertime });
  } catch (err) {
    console.error("Error adding overtime:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all overtime entries
export const getOvertimes = async (req, res) => {
  try {
    const overtimes = await Overtime.find().populate(
      "employee",
      "employeeNumber name"
    );
    res.json(overtimes);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update overtime entry
export const updateOvertime = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      employeeNumber,
      name,
      shift,
      intime,
      outtime,
      reason,
      normalot,
      doubleot,
      tripleot,
      night,
      status,
      date,
    } = req.body;

    const overtime = await Overtime.findById(id);
    if (!overtime)
      return res.status(404).json({ message: "Overtime entry not found" });

    if (overtime.status === "Approved" && status !== "Pending") {
      return res.status(403).json({
        message: "Approved entries cannot be modified",
      });
    }

    if (employeeNumber && employeeNumber !== overtime.employeeNumber) {
      const employee = await Employee.findOne({ employeeNumber });
      if (!employee)
        return res.status(404).json({ message: "Employee not found" });
      overtime.employee = employee._id;
      overtime.employeeNumber = employee.employeeNumber;
      overtime.name = employee.name;
    }

    if (name) overtime.name = name;
    if (shift) overtime.shift = shift;
    if (intime) overtime.intime = intime;
    if (outtime) overtime.outtime = outtime;
    if (reason) overtime.reason = reason;
    if (normalot !== undefined) overtime.normalot = normalot;
    if (doubleot !== undefined) overtime.doubleot = doubleot;
    if (tripleot !== undefined) overtime.tripleot = tripleot;
    if (night !== undefined) overtime.night = String(night).toLowerCase();
    if (status) overtime.status = status;
    if (date) overtime.date = date;

    await overtime.save();
    await logOvertimeAudit("UPDATE", overtime._id, req.body.performedBy, {
      updatedFields: req.body,
    });

    res.json({ message: "Overtime entry updated successfully", overtime });
  } catch (err) {
    console.error("Error updating overtime:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Approve Overtime records
export const approveOvertime = async (req, res) => {
  try {
    const { performedBy, ...details } = req.body;
    const overtime = await Overtime.findById(req.params.id);

    if (!overtime)
      return res.status(404).json({ message: "Overtime entry not found" });

    const previousStatus = overtime.status;

    overtime.status = "Approved";
    await overtime.save();

    await logOvertimeAudit("APPROVE", overtime._id, performedBy, {
      previousStatus,
      newStatus: "Approved",
      ...details,
    });

    res.json({ message: "Overtime approved", overtime });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Reject Overtime records
export const rejectOvertime = async (req, res) => {
  try {
    const { performedBy, ...details } = req.body; // optional reason for rejection
    const overtime = await Overtime.findById(req.params.id);

    if (!overtime)
      return res.status(404).json({ message: "Overtime entry not found" });

    const previousStatus = overtime.status;

    // Prevent approving/rejecting already approved entries
    if (previousStatus === "Approved") {
      return res.status(403).json({
        message: "Approved entries cannot be rejected",
      });
    }

    overtime.status = "Rejected";
    await overtime.save();

    await logOvertimeAudit("REJECT", overtime._id, performedBy, {
      previousStatus,
      newStatus: "Rejected",
      ...details,
    });

    res.json({ message: "Overtime rejected", overtime });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get pending ot
export const getPendingOvertimes = async (req, res) => {
  try {
    const pending = await Overtime.find({ status: "Pending" })
      .sort({ date: -1 })
      .select("employeeNumber name date shift reason normalot");

    res.json({ success: true, pending });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Excel export
export const exportOvertimeExcel = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ message: "Start and end date are required" });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const overtimes = await Overtime.find({
      date: { $gte: start, $lte: end },
    }).sort({ employeeNumber: 1, date: 1 });

    if (!overtimes.length) {
      return res
        .status(404)
        .json({ message: "No overtime records found for this range" });
    }

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Overtime Report");

    const logoPath = path.resolve("assets/logo.png");
    if (fs.existsSync(logoPath)) {
      const logo = workbook.addImage({
        filename: logoPath,
        extension: "png",
      });
      sheet.addImage(logo, {
        tl: { col: 0, row: 0 },
        ext: { width: 150, height: 60 },
      });
    }

    sheet.addRow([]);
    sheet.addRow([]);
    sheet.addRow([]);

    let totalNormal = 0;
    let totalDouble = 0;
    let totalTriple = 0;
    let totalNight = 0;

    overtimes.forEach((ot) => {
      totalNormal += ot.normalot || 0;
      totalDouble += ot.doubleot || 0;
      totalTriple += ot.tripleot || 0;
      if (ot.night?.toLowerCase() === "yes") totalNight++;
    });

    sheet.mergeCells("A4", "F4");
    const title = sheet.getCell("A4");
    title.value = `Overtime Summary (${startDate} → ${endDate})`;
    title.font = { bold: true, size: 14 };
    title.alignment = { horizontal: "center", vertical: "middle" };

    sheet.addRow([]);
    sheet.addRow(["Total Normal OT:", `${totalNormal.toFixed(2)} hrs`]);
    sheet.addRow(["Total Double OT:", `${totalDouble.toFixed(2)} hrs`]);
    sheet.addRow(["Total Triple OT:", `${totalTriple.toFixed(2)} hrs`]);
    sheet.addRow(["Total Night OT:", `${totalNight} shifts`]);

    const summaryRange = ["A6", "A7", "A8", "A9"];
    summaryRange.forEach((cellAddr) => {
      const cell = sheet.getCell(cellAddr);
      cell.font = { bold: true };
      cell.alignment = { horizontal: "left" };
    });

    sheet.addRow([]);
    sheet.addRow([]);
    sheet.addRow(["DETAILED OVERTIME RECORDS"]).font = { bold: true, size: 12 };
    sheet.addRow([
      "Employee Number",
      "Name",
      "Date",
      "Shift",
      "In Time",
      "Out Time",
      "Reason",
      "Normal OT",
      "Double OT",
      "Triple OT",
      "Night",
      "Status",
    ]);

    const headerRow = sheet.lastRow;
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF1F4E78" },
      };
      cell.alignment = { vertical: "middle", horizontal: "center" };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    const employeeRecords = {};
    overtimes.forEach((ot) => {
      if (!employeeRecords[ot.employeeNumber]) {
        employeeRecords[ot.employeeNumber] = [];
      }
      employeeRecords[ot.employeeNumber].push(ot);
    });

    Object.keys(employeeRecords).forEach((empNo) => {
      const records = employeeRecords[empNo];
      sheet.addRow([]);
      const empTitle = sheet.addRow([
        `Employee: ${empNo} - ${records[0].name}`,
      ]);
      empTitle.font = { bold: true, color: { argb: "FF000000" } };

      records.forEach((ot) => {
        sheet.addRow([
          ot.employeeNumber,
          ot.name,
          ot.date.toISOString().split("T")[0],
          ot.shift,
          ot.intime,
          ot.outtime,
          ot.reason,
          ot.normalot,
          ot.doubleot,
          ot.tripleot,
          ot.night?.toLowerCase() === "yes" ? 1 : 0,
          ot.status || "Pending",
        ]);
      });
    });

    sheet.columns.forEach((column) => {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, (cell) => {
        const value = cell.value ? cell.value.toString() : "";
        if (value.length > maxLength) maxLength = value.length;
      });
      column.width = maxLength < 12 ? 12 : maxLength + 2;
    });

    sheet.addRow([]);
    sheet.addRow(["Generated by OTFlow", new Date().toLocaleString()]);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Overtime_Report_${startDate}_to_${endDate}.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to generate Excel file" });
  }
};

// Delete an overtime entry
export const deleteOvertime = async (req, res) => {
  try {
    const { id } = req.params;
    const overtime = await Overtime.findById(id);

    if (!overtime)
      return res.status(404).json({ message: "Overtime entry not found" });

    await Overtime.findByIdAndDelete(id);

    // Log the deleted record details
    await logOvertimeAudit("DELETE", id, req.body.performedBy, {
      deleted: true,
      overtime,
    });

    res.json({ message: "Overtime entry deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
