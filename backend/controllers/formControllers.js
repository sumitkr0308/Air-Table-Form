const Form = require("../models/Form");


const createForm = async (req, res) => {
  try {
    const { name, airtableBaseId, airtableTableId, airtableTableName, questions } = req.body;

    if (!name || !airtableBaseId || !airtableTableId || !questions.length) {
      return res.status(400).json({ error: "Missing required form data" });
    }


    const form = await Form.create({
      owner: req.user._id,
      name,
      airtableBaseId,
      airtableTableId,
      airtableTableName,
      questions
    });

   

    res.status(201).json(form);

  } catch (err) {
    console.error("CREATE FORM ERROR:", err);
    res.status(500).json({ error: "Failed to create form" });
  }
};

const getForms = async (req, res) => {
  const forms = await Form.find({ owner: req.user._id });
  res.json(forms);
};

const getFormById = async (req, res) => {
  const form = await Form.findById(req.params.id);
  form ? res.json(form) : res.status(404).json({ error: "Form not found" });
};

module.exports={
  createForm,
  getForms,
  getFormById
}