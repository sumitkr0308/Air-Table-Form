const Users = require("../models/users");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { generatePKCE } = require("../utils/pkce");



const getLogin = (req, res) => {
  const { codeVerifier, codeChallenge } = generatePKCE();

  
  const stateJWT = jwt.sign(
    { codeVerifier, timestamp: Date.now() },
    process.env.JWT_SECRET,
    { expiresIn: "10m" }
  );

  const params = new URLSearchParams({
    client_id: process.env.AIRTABLE_CLIENT_ID,
    redirect_uri: process.env.AIRTABLE_REDIRECT_URI,
    response_type: "code",
    scope: "data.records:read data.records:write schema.bases:read user.email:read",
    state: stateJWT,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  });

  res.redirect(`https://airtable.com/oauth2/v1/authorize?${params.toString()}`);
};



const getCallback = async (req, res) => {
  const { code, state } = req.query;

  if (!state) return res.status(400).send("Missing state");

  let decoded;
  try {
    decoded = jwt.verify(state, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(400).send("Invalid or expired state");
  }

  const { codeVerifier } = decoded;

  if (!codeVerifier) {
    return res.status(400).send("Missing PKCE verifier");
  }

  try {

    const tokenRes = await axios.post(
      "https://airtable.com/oauth2/v1/token",
      new URLSearchParams({
        grant_type: "authorization_code",
        code,
        client_id: process.env.AIRTABLE_CLIENT_ID,
        redirect_uri: process.env.AIRTABLE_REDIRECT_URI,
        code_verifier: codeVerifier,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const { access_token, refresh_token, expires_in } = tokenRes.data;

    // Save user
    let user = await Users.findOne({ refreshToken: refresh_token });

    if (!user) {
      user = await Users.create({
        airtableId: crypto.randomUUID(),
        accessToken: access_token,
        refreshToken: refresh_token,
        expiresAt: Date.now() + expires_in * 1000,
      });
    }

    // Create app session token
    const appToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.redirect(`${process.env.FRONTEND_URL}/auth?token=${appToken}`);

  } catch (err) {
    console.error("OAuth ERROR:", err.response?.data || err);
    return res.status(500).send("OAuth token exchange failed");
  }
};

module.exports = {
  getLogin,
  getCallback,
};
