const express = require("express");
const auth = require("../middleware/auth");
const formResponseControllers = require("../controllers/formResponseControllers");

const router = express.Router();

router.post("/:formId/submit", auth, formResponseControllers.submitResponse);
router.get("/:formId", auth, formResponseControllers.getResponses);

module.exports = router;
