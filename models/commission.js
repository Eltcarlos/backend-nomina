const mongoose = require("mongoose");

const commissionSchema = new mongoose.Schema(
  {
    experience: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Experience",
      required: true,
      unique: true,
    },
    target: {
      type: Number,
      required: true,
    },
    commissionTier1: {
      type: Number,
      required: true,
    },
    commissionTier2: {
      type: Number,
      required: true,
    },
    commissionTier3: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Commission", commissionSchema);
