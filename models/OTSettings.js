import mongoose from "mongoose";

const OTSettingsSchema = new mongoose.Schema(
  {
    shiftOTStart: {
      type: Map,
      of: Number,
      required: true,
      default: {},
    },
    saturdayShiftHours: {
      type: Map,
      of: Number,
      required: true,
      default: {},
    },
  },
  { timestamps: true }
);

const OTSettings = mongoose.model("OTSettings", OTSettingsSchema);
export default OTSettings;
