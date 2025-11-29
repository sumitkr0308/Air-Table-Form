const express = require("express");
const webhookControllers = require("../controllers/webhookControllers");

const router = express.Router();

router.post("/airtable", webhookControllers.airtableWebhookReceiver);

module.exports = router;
