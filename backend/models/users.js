const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  airtableId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
  },
  email: {
    type: String,
  },

  accessToken: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
  },
  tokenExpiresAt: {
    type: Number,
  },
});

const Users = mongoose.model("Users", userSchema);

module.exports = Users;
