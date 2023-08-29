const mongoose = require("mongoose");
const Commercial = require("../models/commercialAdvisor");
const Experience = require("../models/experience");

/**
 * Handles create Commercial.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} - JSON response indicating success or failure of create.
 */

const create = async (req, res) => {
  const { name, document, email, phone, numberAccount, category, experience, monthlySales } = req.body;
  try {
    const existingCommercial = await Commercial.findOne({ document });
    if (existingCommercial) {
      return res.status(400).json({
        success: false,
        message: "Este Asesor ya existe.",
      });
    }

    const experienceExisting = await Experience.findOne({ level: experience });

    const newCommercial = new Commercial({
      name,
      email,
      phone,
      numberAccount,
      category,
      document,
      experience: experienceExisting._id,
      monthlySales,
    });
    await newCommercial.save();
    res.status(201).json({
      success: true,
      message: "El Asesor se creó correctamente.",
      data: newCommercial,
    });
  } catch (error) {
    console.error(error); // Imprime el error en la consola
    res.status(500).json({
      success: false,
      message: "Hubo un error al crear el Asesor.",
      error,
    });
  }
};

/**
 * Updates a commercial record by its ID.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} - JSON response indicating success or failure of update.
 */

const updateCommercial = async (req, res) => {
  const { name, email, numberAccount, category, phone, experience, monthlySales } = req.body;
  const commercialId = req.params.id;
  try {
    const experienceExisting = await Experience.findOne({ level: experience });
    const updatedCommercial = await Commercial.findByIdAndUpdate(
      commercialId,
      {
        name,
        email,
        numberAccount,
        category,
        phone,
        experience: experienceExisting._id,
        monthlySales,
      },
      { new: true }
    );
    if (!updatedCommercial) {
      return res.status(404).json({
        success: false,
        message: "Asesor no encontrado.",
      });
    }
    res.status(200).json({
      success: true,
      message: "Asesor actualizado correctamente.",
      data: updatedCommercial,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Hubo un error al actualizar el Asesor.",
      error,
    });
  }
};

/**
 * Deletes a commercial record by its ID.
 * @param {Object} req - The request object containing the HTTP request information.
 * @param {Object} res - The response object used to send HTTP responses.
 * @returns {Object} - JSON response indicating success or failure of remove.
 */
const deleteCommercialById = async (req, res) => {
  const commercialId = req.params.id;

  try {
    const deletedCommercial = await Commercial.findByIdAndDelete(commercialId);

    if (!deletedCommercial) {
      return res.status(404).json({
        success: false,
        message: "Asesor no encontrado.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Asesor eliminado correctamente.",
      data: deletedCommercial,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Ah ocurrido un error al momento de eliminar el Asesor.",
      error,
    });
  }
};

/**
 * Retrieves a commercial record by its ID.
 * @param {Object} req - The request object containing the HTTP request information.
 * @param {Object} res - The response object used to send HTTP responses.
 * @returns {Object} - JSON response indicating success or failure of GET.
 */
const getCommercialById = async (req, res) => {
  const commercialId = req.params.id;

  try {
    const commercial = await Commercial.findById(commercialId);

    if (!commercial) {
      return res.status(404).json({
        success: false,
        message: "Asesor no encontrado.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Asesor encontrado correctamente.",
      data: commercial,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Ah ocurrido un error al momento de encontrar al Asesor.",
      error,
    });
  }
};

/**
 * Retrieves all commercial records.
 * @param {Object} req - The request object containing the HTTP request information.
 * @param {Object} res - The response object used to send HTTP responses.
 * @returns {Object} - JSON response indicating success or failure of GET.
 */
const getAllCommercials = async (req, res) => {
  try {
    const commercials = await Commercial.find();
    const commercialsWithData = await Promise.all(
      commercials.map(async (commercial) => {
        const experience = await Experience.findById(commercial.experience);
        return {
          _id: commercial._id,
          name: commercial.name,
          email: commercial.email,
          document: commercial.document,
          phone: commercial.phone,
          numberAccount: commercial.numberAccount,
          category: commercial.category,
          experience: experience.level,
          monthlySales: commercial.monthlySales,
          createdAt: commercial.createdAt,
        };
      })
    );
    res.status(200).json({
      success: true,
      message: "Todos los Asesores se han encontrado.",
      data: commercialsWithData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Ah ocurrido un error al encontrar todos los asesores.",
      error,
    });
  }
};

module.exports = { create, updateCommercial, deleteCommercialById, getCommercialById, getAllCommercials };
