const mongoose = require("mongoose");

const conditionSchema = new mongoose.Schema(
  {
    questionKey: String,
    operator: {
      type: String,
      enum: ["equals", "notEquals", "contains"],
    },
    value: mongoose.Schema.Types.Mixed,
  },
  { _id: false }
);

const questionSchema = new mongoose.Schema(
  {
    questionKey: String,
    label: String,
    airtableFieldId: String,
    airtableFieldName: String,
    type: {
      type: String,
      enum: ["shortText", "longText", "singleSelect", "multiSelect", "attachment"],
    },
    required: Boolean,
    conditionalRules: {
      logic: { type: String, enum: ["AND", "OR"] },
      conditions: [conditionSchema],
    },
  },
  { _id: false }
);

const formSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
    name: String,
    airtableBaseId: String,
    airtableTableId: String,
    airtableTableName: String,
    questions: [questionSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Form", formSchema);
