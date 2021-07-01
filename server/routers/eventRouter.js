const router = require("express").Router();
const jwt = require("jsonwebtoken");
const Event = require("../models/eventModel");

// retrieve Events
router.get("/retrieve", async (req, res) => {
  try {
    const loggedInUserID = jwt.decode(req.cookies.token).user;
    const arrayOfEvents = await Event.find({authorId: loggedInUserID});
    res.json(arrayOfEvents);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

// add Event
router.post("/add", async (req, res) => {
  try {
    const { title, start, end, allDay, color } = req.body;

    if (!title || !start) {
      return res
        .status(400)
        .json({ errorMessage: "Please enter all required fields." });
    }

    const loggedInUserID = jwt.decode(req.cookies.token).user;

    // create a new event object in db
    const newEvent = new Event({
      authorId: loggedInUserID,
      title,
      start,
      end,
      allDay,
      backgroundColor: color,
    });

    await newEvent.save();

    res.send("");
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

// edit Event
router.put("/edit", async (req, res) => {
  
});

// delete Event
router.delete("/delete", async (req, res) => {

});

module.exports = router;
