const mongoose = require("mongoose");
const Commission = require("../models/commission");
const Experience = require("../models/experience");
const experience = require("../models/experience");
/**
 * Handles create Commission.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} - JSON response indicating success or failure of create.
 */

const create = async (req, res) => {
  const { experience, target, commissionTier1, commissionTier2, commissionTier3 } = req.body;
  try {
    const experienceExisting = await Experience.findOne({ level: experience });
    const existingCommission = await Commission.findOne({ experience: experienceExisting._id });
    if (existingCommission) {
      return res.status(400).json({
        success: false,
        message: "Esta Comision ya ha sido creada",
      });
    }
    const newCommission = new Commission({
      experience: experienceExisting,
      target,
      commissionTier1,
      commissionTier2,
      commissionTier3,
    });
    await newCommission.save();
    res.status(201).json({
      success: true,
      message: "la Comisión se creó correctamente.",
      data: newCommission,
    });
  } catch (error) {
    console.error(error); // Imprime el error en la consola
    res.status(500).json({
      success: false,
      message: "Hubo un error al crear la Comisión.",
      error,
    });
  }
};

/**
 * Updates a commission record by its ID.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} - JSON response indicating success or failure of update.
 */

const updateCommission = async (req, res) => {
  const { target, commissionTier1, commissionTier2, commissionTier3 } = req.body;
  const commissionId = req.params.id;
  try {
    const updatedCommission = await Commission.findByIdAndUpdate(
      commissionId,
      {
        target,
        commissionTier1,
        commissionTier2,
        commissionTier3,
      },
      { new: true }
    );
    if (!updatedCommission) {
      return res.status(404).json({
        success: false,
        message: "La Comisión no fue encontrada.",
      });
    }
    res.status(200).json({
      success: true,
      message: "La Comisión fue actualizado correctamente.",
      data: updatedCommission,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Hubo un error al actualizar la Comisión.",
      error,
    });
  }
};

/**
 * Deletes a commission record by its ID.
 * @param {Object} req - The request object containing the HTTP request information.
 * @param {Object} res - The response object used to send HTTP responses.
 * @returns {Object} - JSON response indicating success or failure of remove.
 */
const deleteCommissionById = async (req, res) => {
  const commissionId = req.params.id;

  try {
    const deletedCommission = await Commission.findByIdAndDelete(commissionId);

    if (!deletedCommission) {
      return res.status(404).json({
        success: false,
        message: "La Comisión no fue encontrada.",
      });
    }

    res.status(200).json({
      success: true,
      message: "La Comisión fue eliminada correctamente.",
      data: deletedCommission,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Ah ocurrido un error al momento de eliminar la Comisión.",
      error,
    });
  }
};

/**
 * Retrieves a commission record by its ID.
 * @param {Object} req - The request object containing the HTTP request information.
 * @param {Object} res - The response object used to send HTTP responses.
 * @returns {Object} - JSON response indicating success or failure of GET.
 */
const getCommissionById = async (req, res) => {
  const commissionId = req.params.id;

  try {
    const commission = await Commission.findById(commissionId);

    if (!commission) {
      return res.status(404).json({
        success: false,
        message: "La Comisión no fue encontrada.",
      });
    }

    res.status(200).json({
      success: true,
      message: "La Comisión fue encontrada correctamente.",
      data: commission,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Ah ocurrido un error al momento de encontrar la Comisión.",
      error,
    });
  }
};

/**
 * Retrieves all commission records.
 * @param {Object} req - The request object containing the HTTP request information.
 * @param {Object} res - The response object used to send HTTP responses.
 * @returns {Object} - JSON response indicating success or failure of GET.
 */
const getAllCommissions = async (req, res) => {
  try {
    const commissions = await Commission.find();
    const commissionsWithData = await Promise.all(
      commissions.map(async (commission) => {
        const experience = await Experience.findById(commission.experience);
        return {
          _id: commission._id,
          experienceName: experience.level,
          target: commission.target,
          commissionTier1: commission.commissionTier1,
          commissionTier2: commission.commissionTier2,
          commissionTier3: commission.commissionTier3,
        };
      })
    );
    res.status(200).json({
      success: true,
      message: "Todas las Comisiones se han encontrado.",
      data: commissionsWithData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Ha ocurrido un error al encontrar todas las Comisiones.",
      error,
    });
  }
};

module.exports = { create, getAllCommissions, getCommissionById, deleteCommissionById, updateCommission };
