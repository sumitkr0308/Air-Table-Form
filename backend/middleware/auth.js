const jwt = require("jsonwebtoken");
const User = require("../models/users");

async function auth(req, res, next) {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = header.split(" ")[1];

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user from DB
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (err) {
    console.error("AUTH ERROR:", err);

    return res.status(401).json({
      message: "Authentication failed",
      error: err.message
    });
  }
}

module.exports = auth;
