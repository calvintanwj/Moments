const router = require("express").Router();
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage, fileFilter });

// User profile
// =============================================================================

// Update user details
// JSON should be formatted as {
// name: New name of user
// }
router.put("/userDetails", upload.single("image"), async (req, res) => {
  try {
    const loggedInUserID = jwt.decode(req.cookies.token).user;
    const loggedInUser = await User.findById(loggedInUserID);
    let image = loggedInUser.profilePic;
    let updatedUser;
    if (req.file) {
      image = req.file.filename;
    }

    const newName = req.body.name;

    if (newName !== loggedInUser.name) {
      updatedUser = await User.findOneAndUpdate({ _id: loggedInUserID }, { name: newName }, { new: true });
    }

    if (image !== loggedInUser.profilePic) {
      updatedUser = await User.findOneAndUpdate({ _id: loggedInUserID }, { profilePic: image }, { new: true });
    }

    res.json({ successMessage: "Profile updated successfully", user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});


// GET details for current logged in account
// JSON would be formatted as {
//     resetToken: , (Password reset token assigned to account)
//     _id: String, (User id)
//     profilePicID: int, ()
//     name: String, (Name of user)
//     email: String, (Current registered email address)
//     passwordHash: String, (Hash of password)
//     __v: int,  (Version of profile - not used in this project)
//     confirmed: boolean, (If user has confirmed their account)
//     teleCode: String (Token to link telegram account)
//     profilePic: String (Name of profile image uploaded or defaultprofile.jpg if none uploaded)
// }
router.get("/userDetails", async (req, res) => {
  try {
    const loggedInUserID = jwt.decode(req.cookies.token).user;
    const loggedInUser = await User.findById(loggedInUserID);
    res.send(loggedInUser);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

// User Email Address
// =============================================================================


// POST account email address
// JSON should be formatted as {
// newEmail: String (New email for user account)
// }
router.put("/email", async (req, res) => {
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

    const updatedUser = await User.findOneAndUpdate({ _id: loggedInUserID }, { email: lowerCaseEmail }, { new: true });

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

    res.json({ successMessage: "Email updated successfully", user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

// User account password
// =============================================================================

// POST account password 
// JSON should be formatted as {
// oldPassword: String,
// newPassword: String,
// newPasswordVerify: String
// }
router.put("/password", async (req, res) => {
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

    res.json({ successMessage: "Password changed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

// =============================================================================

module.exports = router;
