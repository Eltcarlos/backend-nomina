const mongoose = require("mongoose");

const experienceSchema = new mongoose.Schema(
  {
    level: {
      type: String,
      enum: ["Junior", "Senior", "Master"],
      required: true,
    },
    salary: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Experience", experienceSchema);
