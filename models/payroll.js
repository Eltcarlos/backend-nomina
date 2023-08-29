const mongoose = require("mongoose");

const payrollSchema = new mongoose.Schema(
  {
    commercialAdvisor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CommercialAdvisor",
      required: true,
    },
    commissions: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Commission",
      required: true,
    },
    healthInsurance: {
      type: Number,
      required: true,
    },
    pension: {
      type: Number,
      required: true,
    },
    laborRisks: {
      type: Number,
      required: true,
    },
    totalDeductions: {
      type: Number,
      required: true,
    },
    totalEarnings: {
      type: Number,
      required: true,
    },
    netSalary: {
      type: Number,
      required: true,
    },
    PDF: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

payrollSchema.index({ commercialAdvisor: 1, commissions: 1 });

module.exports = mongoose.model("Payroll", payrollSchema);
