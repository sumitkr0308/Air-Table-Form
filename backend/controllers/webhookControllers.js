const FormResponse = require("../models/FormResponse");

const airtableWebhookReceiver = async (req, res) => {
  
  const { recordId, type, updatedFields } = req.body;

  if (!recordId) {
    return res.status(400).json({ message: "No recordId provided" });
  }

  if (type === "updated") {
    await FormResponse.findOneAndUpdate(
      { airtableRecordId: recordId },
      { $set: { answers: updatedFields } }
    );
  }

  if (type === "deleted") {
    await FormResponse.findOneAndUpdate(
      { airtableRecordId: recordId },
      { deletedInAirtable: true }
    );
  }

  res.json({ success: true });
};
module.exports={
  airtableWebhookReceiver,
}
