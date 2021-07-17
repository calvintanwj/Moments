const router = require("express").Router();
const jwt = require("jsonwebtoken");
const Event = require("../models/eventModel");

// retrieve Events
router.get("/retrieve", async (req, res) => {
  try {
    const loggedInUserID = jwt.decode(req.cookies.token).user;
    const arrayOfEvents = await Event.find({ authorId: loggedInUserID });
    res.json(arrayOfEvents);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

// add Event
router.post("/add", async (req, res) => {
  try {
    const { title, start, end, allDay, color, reminder } = req.body;

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
      reminder
    });

    await newEvent.save();

    res.status(200).send();
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

// edit Event
router.put("/edit", async (req, res) => {
  try {
    const { title, start, end, color, allDay, reminder, editingEvent } = req.body;
    const eventId = editingEvent.extendedProps._id;

    await Event.findOneAndUpdate(
      { _id: eventId },
      {
        title,
        start,
        end,
        backgroundColor: color,
        allDay,
        reminder
      }
    );

    res.status(200).send();
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

// delete Event
router.post("/delete", async (req, res) => {
  try {
    const eventId = req.body.extendedProps._id;
    await Event.findOneAndDelete({ _id: eventId });

    res.status(200).send();
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

// resize Event
router.put("/resize", async (req, res) => {
  try {
    const { start, end, extendedProps } = req.body;
    const eventId = extendedProps._id;
    await Event.findOneAndUpdate(
      { _id: eventId },
      {
        start,
        end,
      }
    );
    res.status(200).send();
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

// event drop
router.put("/drop", async (req, res) => {
  try {
    const { start, end, extendedProps } = req.body;
    const eventId = extendedProps._id;
    if (start.indexOf("T") === -1) {
      await Event.findOneAndUpdate(
        { _id: eventId },
        {
          start,
          end,
          allDay: true,
        }
      );
    } else {
      await Event.findOneAndUpdate(
        { _id: eventId },
        {
          start,
          end,
	  allDay: false,
        }
      );
    }
    res.status(200).send();
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

module.exports = router;
