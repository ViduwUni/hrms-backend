import TripleOT from "../models/TripleOT.js";

// Add Triple OT date
export const addTripleOT = async (req, res) => {
  try {
    const { date, description } = req.body;

    if (!date) return res.status(400).json({ message: "Date is required" });

    // Prevent duplicate entry for same date
    const existing = await TripleOT.findOne({ date });
    if (existing)
      return res
        .status(400)
        .json({ message: "Triple OT already added for this date" });

    const newTripleOT = new TripleOT({ date, description });
    await newTripleOT.save();

    res
      .status(201)
      .json({ message: "Triple OT added successfully", data: newTripleOT });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all Triple OT dates
export const getTripleOTs = async (req, res) => {
  try {
    const tripleOTs = await TripleOT.find().sort({ date: -1 });
    res.status(200).json(tripleOTs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Edit Triple OT
export const updateTripleOT = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, description } = req.body;

    const updated = await TripleOT.findByIdAndUpdate(
      id,
      { date, description },
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ message: "Triple OT not found" });

    res
      .status(200)
      .json({ message: "Triple OT updated successfully", data: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Triple OT
export const deleteTripleOT = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await TripleOT.findByIdAndDelete(id);

    if (!deleted)
      return res.status(404).json({ message: "Triple OT not found" });

    res.status(200).json({ message: "Triple OT deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
