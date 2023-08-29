const mongoose = require("mongoose");

const commercialAdvisorSchema = new mongoose.Schema(
  {
    name: {
      type: {
        firstName: {
          type: String,
          required: true,
        },
        lastName: {
          type: String,
          required: true,
        },
      },
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
    },
    document: {
      type: Number,
      required: true,
      unique: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    numberAccount: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      enum: ["Programador", "Ingeniero", "Administrador"],
      default: "Programador",
    },
    experience: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Experience",
      required: true,
    },
    monthlySales: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CommercialAdvisor", commercialAdvisorSchema);
