const router = require("express").Router()
const journalEntry = require("../models/journalEntryModel");
const jwt = require("jsonwebtoken");


// Middleware
// =============================================================================================================
var getUser = function (req, res, next) {
	// Get user_id
	req.user = jwt.decode(req.cookies.token, process.env.JWT_SECRET).user;
	console.log(`User making request: ${req.user}`);
	next();
}

router.use(getUser);
router.use(function (req, res, next) {
	console.log(req.body);
	next();
})

// Create journal entry
// JSON should be formatted as {
// date: year-month-date
// entry: String
// }
router.post("/", async (req, res) => {
	try {
		const { date, entry } = req.body;
		const user_id = req.user;

		const newJournalEntry = new journalEntry({ date: Date.parse(date), entry, user_id });
		const savedJournalEntry = await newJournalEntry.save();
		return res.status(201).json({ message: "Journal entry has been created" });
	} catch (err) {
		return res.status(400).json({ error: "Could not post journal entry" });
		console.log(err);
	}
});

router.get("/currentUser", async (req, res) => {
	const { token } = req.body;
	console.log("Checking current user");
	return res.status(400).json({ user: getUser(token).user });
});

// Read journal entry
// date should be in format year-month-day
router.get("/:date", async (req, res) => {
	try {
		const { date } = req.params
		const user_id = req.user;

		parsedDate = Date.parse(date);
		matchedEntries = await journalEntry.find({ date: parsedDate, user_id }).lean()
		return res.status(200).json({ entries: matchedEntries });


	} catch (err) {
		return res.status(400).json({ error: "Could not get journal entry" })
		console.log(err);

	}
});

router.put("/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const { entry } = req.body;
		const user_id = req.user;
		let matchedEntries = await journalEntry.findOneAndUpdate({ _id: id, user_id }, { entry }, { new: true });
		return res.status(200).json({ message: "Entry has been updated" });


	} catch (err) {
		console.log(err);
		return res.status(400).json({ error: "Could not update journal entry" });
	}
});

router.delete("/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const user_id = req.user;

		matchedEntries = await journalEntry.findOneAndDelete({ _id: id, user_id });
		return res.status(200).json({ message: "Entry has been deleted" });


	} catch (err) {
		return res.status(200).json({ message: "Could not delete journal entry" });
		console.log(err);

	}
});



module.exports = router;