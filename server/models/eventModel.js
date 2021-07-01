const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  authorId: { type: String, required: true },
  title: { type: String, required: true },
  start: { type: String, required: true },
  end: { type: String },
  allDay: { type: Boolean, defaultValue: false },
  backgroundColor: { type: String, defaultValue: "lightblue" },
});

const Event = mongoose.model("events", eventSchema);

module.exports = Event;
