const express = require("express");
const auth = require("../middleware/auth");
const formControllers = require("../controllers/formControllers");


const router = express.Router();

router.post("/", auth, formControllers.createForm);
router.get("/", auth, formControllers.getForms);
router.get("/:id", auth, formControllers.getFormById);

module.exports = router;
