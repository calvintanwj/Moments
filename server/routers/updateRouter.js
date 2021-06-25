const router = require("express").Router();
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

router.post("/userDetails", async (req, res) => {
  try {
    const { newName, newPicID } = req.body;
    const loggedInUserID = jwt.decode(req.cookies.token).user;
    if (newName !== "") {
      await User.updateOne({ _id: loggedInUserID }, { name: newName });
    }
    await User.updateOne({ _id: loggedInUserID }, { profilePicID: newPicID });
    res.send("");
  } catch (err) {
    console.log("Error");
  }
});

router.get("/retrieveDetails", async (req, res) => {
  try {
    const loggedInUserID = jwt.decode(req.cookies.token).user;
    const loggedInUser = await User.findById(loggedInUserID);
    res.send(loggedInUser);
  } catch (err) {
    console.log("Error");
  }
});

module.exports = router;
