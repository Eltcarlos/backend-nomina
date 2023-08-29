const { Router } = require("express");
const commission = require("../controllers/commission");

const router = Router();

router.get("/all", commission.getAllCommissions);
router.get("/commission/:id", commission.getCommissionById);
router.post("/create", commission.create);
router.put("/update/:id", commission.updateCommission);
router.delete("/remove/:id", commission.deleteCommissionById);

module.exports = router;
