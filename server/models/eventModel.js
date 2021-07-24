const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  authorId: { type: String, required: true },
  title: { type: String, required: true },
  start: { type: String, required: true },
  end: { type: String },
  allDay: { type: Boolean, defaultValue: false },
  color: { type: String, defaultValue: "#2196f3" },
  reminder: { type: String },
});

const Event = mongoose.model("events", eventSchema);

module.exports = Event;
