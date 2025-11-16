import OvertimeReason from "../models/OvertimeReason.js";

// GET all overtime options
export const getOvertimeOptions = async (req, res) => {
    try {
        const options = await OvertimeReason.find().sort({ createdAt: -1 });
        res.status(200).json(options);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ADD new overtime option
export const addOvertimeOption = async (req, res) => {
    try {
        const { option } = req.body;

        if (!option) {
            return res.status(400).json({ error: "Option is required" });
        }

        const exists = await OvertimeReason.findOne({ option });
        if (exists) {
            return res.status(400).json({ error: "Option already exists" });
        }

        const newOption = await OvertimeReason.create({ option });
        res.status(201).json(newOption);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE option
export const deleteOvertimeOption = async (req, res) => {
    try {
        const { id } = req.params;
        await OvertimeReason.findByIdAndDelete(id);
        res.status(200).json({ message: "Option deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
