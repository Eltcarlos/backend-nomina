const { Router } = require("express");
const commercial = require("../controllers/commercialAdvisor");

const router = Router();

router.get("/all", commercial.getAllCommercials);
router.get("/commercial/:id", commercial.getCommercialById);
router.post("/create", commercial.create);
router.put("/update/:id", commercial.updateCommercial);
router.delete("/remove/:id", commercial.deleteCommercialById);

module.exports = router;
