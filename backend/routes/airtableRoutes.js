const express = require("express");
const axios = require("axios");
const auth = require("../middleware/auth");

const router = express.Router();

// Airtable API instance
function airtableClient(token) {
  return axios.create({
    baseURL: "https://api.airtable.com/v0/",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

router.get("/bases", auth, async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.airtable.com/v0/meta/bases",
      {
        headers: {
          Authorization: `Bearer ${req.user.accessToken}`,
        },
      }
    );

    console.log("BASE RESPONSE:", response.data);
    res.json(response.data);
  } catch (err) {
    console.log(err.response?.data || err);
    res.status(500).json({ error: "Failed to fetch bases" });
  }
});




const SUPPORTED_FIELDS = [
  "singleLineText",
  "multilineText",
  "singleSelect",
  "multipleSelects",
  "multipleAttachments"
];

router.get("/bases/:baseId/tables", auth, async (req, res) => {
  try {
    const client = airtableClient(req.user.accessToken);

    const response = await client.get(`meta/bases/${req.params.baseId}/tables`);

    
    const tables = response.data.tables.map(table => ({
      id: table.id,
      name: table.name,
      fields: table.fields.filter(f => SUPPORTED_FIELDS.includes(f.type))
    }));

    res.json({ tables });

  } catch (err) {
    console.error("ERROR Fetching Tables:", err.response?.data || err);
    res.status(500).json({ error: "Unable to fetch tables" });
  }
});

router.get("/bases/:baseId/tables/:tableId/fields", auth, async (req, res) => {
  try {
    const client = airtableClient(req.user.accessToken);

    const response = await client.get(
      `meta/bases/${req.params.baseId}/tables`
    );

    const table = response.data.tables.find(t => t.id === req.params.tableId);

    if (!table) {
      return res.status(404).json({ error: "Table not found" });
    }


    const fields = table.fields.filter(f =>
      SUPPORTED_FIELDS.includes(f.type)
    );

    res.json({ fields });

  } catch (err) {
    console.error("ERROR Fetching Fields:", err.response?.data || err.message);
    res.status(500).json({ error: "Unable to fetch fields" });
  }
});
module.exports = router;
