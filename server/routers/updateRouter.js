const router = require("express").Router();
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");

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
    console.error(err);
    res.status(500).send();
  }
});

router.get("/retrieveDetails", async (req, res) => {
  try {
    const loggedInUserID = jwt.decode(req.cookies.token).user;
    const loggedInUser = await User.findById(loggedInUserID);
    res.send(loggedInUser);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.post("/email", async (req, res) => {
  try {
    const { newEmail } = req.body;
    const lowerCaseEmail = newEmail.toLowerCase();
    const loggedInUserID = jwt.decode(req.cookies.token).user;

    if (!newEmail) {
      return res
        .status(400)
        .json({ errorMessage: "Please enter all required fields." });
    }

    const existingUser = await User.findOne({ email: lowerCaseEmail });
    const loggedInUser = await User.findOne({ _id: loggedInUserID });
    const oldEmail = loggedInUser.email;

    if (existingUser) {
      return res.status(400).json({
        errorMessage: "There is already an existing user with that email",
      });
    }

    await User.updateOne({ _id: loggedInUserID }, { email: lowerCaseEmail });

    let transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_SENDER, // generated ethereal user
        pass: process.env.EMAIL_PASS, // generated ethereal password
      },
    });

    transporter.sendMail({
      from: "Moments <momentsorbital@gmail.com>",
      to: oldEmail,
      subject: "Email Change Email",
      html: `Your email address for your Moments account has been changed: <br><br>

      This is a confirmation that your email been changed at ${new Date()} to ${newEmail}<br><br>

      Didn't change your email? Contact Moments Support so we can make sure no one else is trying to access your account. <br><br>
      
      Thanks, <br>
      The Moments Team`,
    });

    res.send("");
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.post("/password", async (req, res) => {
  try {
    const { oldPassword, newPassword, newPasswordVerify } = req.body;
    const loggedInUserID = jwt.decode(req.cookies.token).user;
    const loggedInUser = await User.findOne({ _id: loggedInUserID });

    if (!oldPassword || !newPassword || !newPasswordVerify) {
      return res
        .status(400)
        .json({ errorMessage: "Please enter all required fields." });
    }

    if (newPassword !== newPasswordVerify) {
      return res.status(400).json({
        errorMessage: "Passwords do not match",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        errorMessage: "Please enter a new password of at least 8 characters",
      });
    }

    const passwordCorrect = await bcrypt.compare(
      oldPassword,
      loggedInUser.passwordHash
    );

    if (!passwordCorrect) {
      return res.status(401).json({ errorMessage: "Old password isn't valid" });
    }

    const salt = await bcrypt.genSalt();
    const newPasswordHash = await bcrypt.hash(newPassword, salt);

    await User.updateOne(
      { _id: loggedInUserID },
      { passwordHash: newPasswordHash }
    );

    let transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_SENDER, // generated ethereal user
        pass: process.env.EMAIL_PASS, // generated ethereal password
      },
    });

    transporter.sendMail({
      from: "Moments <momentsorbital@gmail.com>",
      to: loggedInUser.email,
      subject: "Password Change Email",
      html: `Your password for your Moments account has been changed: <br><br>

      This is a confirmation that your password has been changed at ${new Date()}<br><br>

      Didn't change your password? Contact Moments Support so we can make sure no one else is trying to access your account. <br><br>

      Thanks, <br>
      The Moments Team`,
    });

    res.send("");
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

module.exports = router;
