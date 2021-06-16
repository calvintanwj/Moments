const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Name is required"] },
  email: {
    type: String,
    required: [true, "Email address is required"],
  },
  passwordHash: {
    type: String,
    required: [true, "Password is required"],
  },
});

const User = mongoose.model("user", userSchema);

module.exports = User;
