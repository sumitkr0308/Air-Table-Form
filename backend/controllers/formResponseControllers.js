const axios = require("axios");
const Form = require("../models/Form");
const FormResponse = require("../models/FormResponse");

// SUBMIT A FORM RESPONSE
const submitResponse = async (req, res) => {
  try {
    const form = await Form.findById(req.params.formId);
    if (!form) return res.status(404).json({ error: "Form not found" });

    const answers = req.body;

  
    for (const q of form.questions) {
      if (q.required && !answers[q.questionKey]) {
        return res.status(400).json({ error: `Missing required field: ${q.label}` });
      }
    }

    // Build Airtable payload
    const airtablePayload = { fields: {} };

    form.questions.forEach(q => {
      const fieldName = q.airtableFieldName || q.label;
      airtablePayload.fields[fieldName] = answers[q.questionKey];
    });

    
    // Submit to Airtable
    const airtableRes = await axios.post(
      `https://api.airtable.com/v0/${form.airtableBaseId}/${encodeURIComponent(form.airtableTableName)}`,
      airtablePayload,
      {
        headers: {
          Authorization: `Bearer ${req.user.accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Save to MongoDB
    const saved = await FormResponse.create({
      formId: form._id,
      userId: req.user._id,
      airtableRecordId: airtableRes.data.id,
      answers,
    });

    res.status(201).json(saved);
  } catch (err) {
    console.error("FORM SUBMIT ERROR:", err.response?.data || err);
    res.status(500).json({ error: "Failed to submit response" });
  }
};



// GET ALL RESPONSES FOR A FORM
const getResponses = async (req, res) => {
  try {
    const responses = await FormResponse.find({ formId: req.params.formId })
      .sort({ createdAt: -1 });

    res.json(responses);
  } catch (err) {
    console.error("FETCH RESPONSES ERROR:", err);
    res.status(500).json({ error: "Failed to fetch responses" });
  }
};

module.exports={
  submitResponse,
  getResponses
}

