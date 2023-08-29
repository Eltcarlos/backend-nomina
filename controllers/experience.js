const Experience = require("../models/experience");

/**
 * Handles create experience.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} - JSON response indicating success or failure of create.
 */

const create = async (req, res) => {
  const { level, salary } = req.body;
  try {
    const existingLevel = await Experience.findOne({ level });
    if (existingLevel) {
      return res.status(400).json({
        success: false,
        message: "Este nivel ya existe.",
      });
    }
    const newLevel = new Experience({
      level,
      salary,
    });
    await newLevel.save();
    res.status(201).json({
      success: true,
      message: "El nivel se creó correctamente.",
      data: newLevel,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Hubo un error al crear el nivel de experiencia.",
      error,
    });
  }
};

/**
 * Handles updating the salary of a level of experience.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} - JSON response indicating success or failure of salary update.
 */

const updateSalary = async (req, res) => {
  const { salary } = req.body;
  const levelId = req.params.id;

  try {
    const updatedLevel = await Experience.findByIdAndUpdate(levelId, { $set: { salary } }, { new: true });

    if (!updatedLevel) {
      return res.status(404).json({
        success: false,
        message: "Nivel de experiencia no encontrado.",
      });
    }

    res.status(200).json({
      success: true,
      message: "El salario del nivel se actualizó correctamente.",
      data: updatedLevel,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Hubo un error al actualizar el salario del nivel de experiencia.",
      error,
    });
  }
};

module.exports = { create, updateSalary };
