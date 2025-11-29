const Users = require("../models/users");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { generatePKCE } = require("../utils/pkce");

// Temporary state storage
const stateStore = new Map();


const getLogin = (req, res) => {
  const { codeVerifier, codeChallenge } = generatePKCE();
  const state = crypto.randomBytes(20).toString("hex");

  stateStore.set(state, { codeVerifier });

  const params = new URLSearchParams({
    client_id: process.env.AIRTABLE_CLIENT_ID,
    redirect_uri: process.env.AIRTABLE_REDIRECT_URI,
    response_type: "code",
    scope: "data.records:read data.records:write schema.bases:read user.email:read",
    state,
    code_challenge: codeChallenge,
    code_challenge_method: "S256"
  });

  res.redirect(`https://airtable.com/oauth2/v1/authorize?${params.toString()}`);
};

const getCallback = async (req, res) => {


  const { code, state } = req.query;
  const savedState = stateStore.get(state);

  if (!savedState) return res.status(400).send("Invalid state");

  const { codeVerifier } = savedState;
  stateStore.delete(state);

  try {
    // auth code for access token (PKCE)
    const tokenRes = await axios.post(
      "https://airtable.com/oauth2/v1/token",
      new URLSearchParams({
        grant_type: "authorization_code",
        code,
        client_id: process.env.AIRTABLE_CLIENT_ID,
        redirect_uri: process.env.AIRTABLE_REDIRECT_URI,
        code_verifier: codeVerifier
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );



    const { access_token, refresh_token, expires_in } = tokenRes.data;

    // Save user or update
    let user = await Users.findOne({ accessToken: access_token });

    if (!user) {
      user = await Users.create({
        airtableId: crypto.randomUUID(),
        accessToken: access_token,
        refreshToken: refresh_token,
        expiresAt: Date.now() + expires_in * 1000
      });
    }

    // Create our app token
    const appToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("Login success, redirecting to frontend...");


    return res.redirect(`${process.env.FRONTEND_URL}/auth?token=${appToken}`);

  } catch (err) {
    console.error("OAuth ERROR:", err.response?.data || err);
    return res.status(500).send("OAuth token exchange failed");
  }
};

module.exports = {
  getLogin,
  getCallback
};
