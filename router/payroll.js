const { Router } = require("express");
const payroll = require("../controllers/payroll");

const router = Router();

router.get("/all", payroll.getAllPayroll);
router.post("/create", payroll.create);
router.get("/payroll/:id", payroll.getPayrollById);
router.delete("/remove/:id", payroll.deletePayrollById);

module.exports = router;
