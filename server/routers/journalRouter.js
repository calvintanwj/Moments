const router = require("express").Router();
const journalEntry = require("../models/journalEntryModel");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

// CRUD operations
// =============================================================================================================

// Create journal entry
// JSON should be formatted as {
// date: year-month-date
// entry: String
// }
router.post("/", auth, async (req, res) => {
  try {
    const { date, title, entry } = req.body;
    const user_id = req.user;

    reqData = { title, entry, user_id };
    const newJournalEntry = new journalEntry({
      ...reqData,
      date: Date.parse(date),
    });
    const savedJournalEntry = await newJournalEntry.save();
    return res.status(201).json({
      message: "Journal entry has been created",
      data: savedJournalEntry,
    });
  } catch (err) {
    console.err(err);
    return res.status(400).json({ error: "Could not create journal entry" });
  }
});

// Get all journal entries posted on a date
// JSON should be formatted as {
// date: year-month-date
// }
router.get("/:date", auth, async (req, res) => {
  try {
    const { date } = req.params;
    const user_id = req.user;

    parsedDate = Date.parse(date);
    matchedEntries = await journalEntry
      .find({ date: parsedDate, user_id })
      .lean();
    return res.status(200).json({ entries: matchedEntries });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: "Could not get journal entry" });
  }
});

// Update journal entry
// JSON should be formatted as {
// entry: Contents of new entry
// }
router.put("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { date, title, entry } = req.body;
    const user_id = req.user;
    const parsedDate = Date.parse(date);

    let matchedEntry = await journalEntry.findOneAndUpdate(
      { _id: id, user_id },
      { date: parsedDate, title, entry },
      { new: true }
    );
    // findOneAndDelete returns null, if a post with the conditions is not found
    if (matchedEntry == null) {
      return res.status(404).json({ message: "Post does not exist" });
    }
    return res.status(200).json({
      message: "Journal entry has been updated",
      data: matchedEntry,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: "Could not update journal entry" });
  }
});

// Delete journal entry
// no JSON required
router.delete("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user;

    matchedEntries = await journalEntry.findOneAndDelete({ _id: id, user_id });
    // findOneAndDelete returns null, if a post with the conditions is not found
    if (matchedEntries == null) {
      return res.status(404).json({ message: "Post does not exist" });
    }
    return res.status(200).json({ message: "Journal entry has been deleted" });
  } catch (err) {
    console.err(err);
    return res.status(400).json({ message: "Could not delete journal entry" });
  }
});

module.exports = router;
