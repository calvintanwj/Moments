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
  confirmed: {
    type: Boolean,
    defaultValue: false,
  },
  resetToken: {
    data: String,
    default: "",
  },
  profilePic: {
    type: String,
    defaultValue: "defaultprofile.jpg"
  },
  teleCode: {
    type: String,
  },
  chat_id: {
    type: Number,
  }
});

const User = mongoose.model("user", userSchema);

module.exports = User;
