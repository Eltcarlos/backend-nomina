const { Router } = require("express");
const experience = require("../controllers/experience");

const router = Router();

router.post("/create", experience.create);
router.put("/update/:id", experience.updateSalary);

module.exports = router;
