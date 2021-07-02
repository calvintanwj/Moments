const mongoose = require("mongoose");

const journalEntrySchema = new mongoose.Schema({
	date: Date,
	entry: String,
	user_id: String
});

const JournalEntry = mongoose.model("journalEntry", journalEntrySchema);
module.exports = JournalEntry;