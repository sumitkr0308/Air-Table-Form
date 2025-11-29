const crypto = require("crypto");

function base64url(input) {
  return input.toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function generatePKCE() {
  const codeVerifier = base64url(crypto.randomBytes(32));
  const codeChallenge = base64url(
    crypto.createHash("sha256").update(codeVerifier).digest()
  );

  return { codeVerifier, codeChallenge };
}

module.exports = { generatePKCE };
