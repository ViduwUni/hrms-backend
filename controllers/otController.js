import OTSettings from "../models/OTSettings.js";

// Create OT Settings
export const createOTSettings = async (req, res) => {
  try {
    const { shiftOTStart, saturdayShiftHours } = req.body;

    const existing = await OTSettings.findOne();
    if (existing) {
      return res
        .status(400)
        .json({ error: "Settings already exist. Use update." });
    }

    const settings = await OTSettings.create({
      shiftOTStart,
      saturdayShiftHours,
    });

    res.status(201).json({ message: "OT Settings created", settings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get OT Settings
export const getOTSettings = async (req, res) => {
  try {
    const settings = await OTSettings.find();
    res.json({ settings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update OT Settings
export const updateOTSettings = async (req, res) => {
  try {
    const { shiftOTStart, saturdayShiftHours } = req.body;

    const settings = await OTSettings.findOneAndUpdate(
      {},
      { shiftOTStart, saturdayShiftHours },
      { new: true, upsert: true }
    );

    res.json({ message: "OT Settings updated", settings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete OT Settings
export const deleteOTSettings = async (req, res) => {
  try {
    await OTSettings.deleteMany();
    res.json({ message: "OT Settings deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
