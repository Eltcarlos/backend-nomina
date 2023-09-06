const express = require("express");
const auth = require("./auth");

const user = require("./user");

// Route Main
const routerMain = express.Router();
const { authenticateToken } = require("../middlewares/authUser");

// Route Children
routerMain.use("/api/v1/auth", auth);

module.exports = routerMain;
