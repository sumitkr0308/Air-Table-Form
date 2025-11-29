const mongoose = require("mongoose");

const formResponseSchema = new mongoose.Schema(
  {
    formId: { type: mongoose.Schema.Types.ObjectId, ref: "Form" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
    airtableRecordId: String,
    answers: Object,
    deletedInAirtable: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("FormResponse", formResponseSchema);
