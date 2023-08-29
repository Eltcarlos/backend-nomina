const mongoose = require("mongoose");
const Payroll = require("../models/payroll");
const Experience = require("../models/experience");
const Commission = require("../models/commission");
const calculatePayroll = require("../utils/calculatePayroll");
/**
 * Handles create Payroll.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} - JSON response indicating success or failure of create.
 */

const create = async (req, res) => {
  const { commercialAdvisorId, experience } = req.body;
  try {
    const { healthInsurance, pension, laborRisks, totalDeductions, totalEarnings, netSalary, PDF } =
      await calculatePayroll(commercialAdvisorId);

    const experienceExisting = await Experience.findOne({ level: experience });
    console.log(experienceExisting);
    const commissionExisting = await Commission.findOne({ experience: experienceExisting._id });
    console.log(commissionExisting);

    const newPayroll = new Payroll({
      commercialAdvisor: new mongoose.Types.ObjectId(commercialAdvisorId),
      commissions: commissionExisting._id,
      healthInsurance,
      pension,
      laborRisks,
      totalDeductions,
      totalEarnings,
      netSalary,
      PDF,
    });
    await newPayroll.save();
    res.status(201).json({
      success: true,
      message: "La Nomina se creó correctamente.",
      data: newPayroll,
    });
  } catch (error) {
    console.error(error); // Imprime el error en la consola
    res.status(500).json({
      success: false,
      message: "Hubo un error al crear la Nomina.",
      error,
    });
  }
};

/**
 * Deletes a payroll record by its ID.
 * @param {Object} req - The request object containing the HTTP request information.
 * @param {Object} res - The response object used to send HTTP responses.
 * @returns {Object} - JSON response indicating success or failure of remove.
 */
const deletePayrollById = async (req, res) => {
  const payrollId = req.params.id;

  try {
    const deletedPayroll = await Payroll.findByIdAndDelete(payrollId);

    if (!deletedPayroll) {
      return res.status(404).json({
        success: false,
        message: "La Nomina no fue encontrada.",
      });
    }

    res.status(200).json({
      success: true,
      message: "La Nomina fue eliminada correctamente.",
      data: deletedPayroll,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Ah ocurrido un error al momento de eliminar la Nomina.",
      error,
    });
  }
};

/**
 * Retrieves a payroll record by its ID.
 * @param {Object} req - The request object containing the HTTP request information.
 * @param {Object} res - The response object used to send HTTP responses.
 * @returns {Object} - JSON response indicating success or failure of GET.
 */
const getPayrollById = async (req, res) => {
  const payrollId = req.params.id;

  try {
    const payroll = await Payroll.findById(payrollId);

    if (!payroll) {
      return res.status(404).json({
        success: false,
        message: "La Nomina no fue encontrada.",
      });
    }

    res.status(200).json({
      success: true,
      message: "La Nomina fue encontrada correctamente.",
      data: payroll,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Ah ocurrido un error al momento de encontrar la Nomina.",
      error,
    });
  }
};

/**
 * Retrieves all payroll records.
 * @param {Object} req - The request object containing the HTTP request information.
 * @param {Object} res - The response object used to send HTTP responses.
 * @returns {Object} - JSON response indicating success or failure of GET.
 */
const getAllPayroll = async (req, res) => {
  try {
    const payroll = await Payroll.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "Todos las Nominas se han encontrado.",
      data: payroll,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Ah ocurrido un error al encontrar todos las Nominas.",
      error,
    });
  }
};

module.exports = { create, deletePayrollById, getPayrollById, getAllPayroll };
