const express = require("express");
const auth = require("./auth");
const experience = require("./experience");
const commercialAdvisor = require("./commercialAdvisor");
const commission = require("./commission");
const payroll = require("./payroll");
const user = require("./user");

// Route Main
const routerMain = express.Router();
const { authenticateToken } = require("../middlewares/authUser");

// Route Children
routerMain.use("/api/v1/auth", auth);
routerMain.use("/api/v1/experience", authenticateToken, experience);
routerMain.use("/api/v1/commercial", authenticateToken, commercialAdvisor);
routerMain.use("/api/v1/commission", authenticateToken, commission);
routerMain.use("/api/v1/payroll", authenticateToken, payroll);
routerMain.use("/api/v1/user", authenticateToken, user);

module.exports = routerMain;
