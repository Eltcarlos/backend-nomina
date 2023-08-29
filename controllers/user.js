const Users = require("../models/user");

/**
 * Retrieves all users records.
 * @param {Object} req - The request object containing the HTTP request information.
 * @param {Object} res - The response object used to send HTTP responses.
 * @returns {Object} - JSON response indicating success or failure of GET.
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await Users.find({}, { password: 0, updatedAt: 0 });

    const sanitizedUsers = users.map((user) => {
      const { password, updatedAt, ...sanitizedUser } = user.toObject();
      return sanitizedUser;
    });

    res.status(200).json({
      success: true,
      message: "Todos los usuarios se han encontrado.",
      data: sanitizedUsers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Ha ocurrido un error al encontrar todos los Usuarios.",
      error,
    });
  }
};

module.exports = { getAllUsers };
