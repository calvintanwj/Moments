const router = require("express").Router();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

// registration
router.post("/", async (req, res) => {
  try {
    const { name, email, password, passwordVerify } = req.body;

    const lowerCaseEmail = email.toLowerCase();

    // validate
    if (!name || !email || !password || !passwordVerify) {
      return res
        .status(400)
        .json({ errorMessage: "Please enter all required fields." });
    }

    if (password.length < 8) {
      return res.status(400).json({
        errorMessage: "Please enter a password of at least 8 characters",
      });
    }

    if (password !== passwordVerify) {
      return res.status(400).json({
        errorMessage: "Passwords do not match",
      });
    }

    const existingUser = await User.findOne({ lowerCaseEmail });

    if (existingUser) {
      return res.status(400).json({
        errorMessage: "An account with this email already exists",
      });
    }

    // encrypt (hash) password
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    // register a new user account to db
    const newUser = new User({
      name,
      email: lowerCaseEmail,
      passwordHash,
    });

    const savedUser = await newUser.save();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_SENDER, // generated ethereal user
        pass: process.env.EMAIL_PASS, // generated ethereal password
      },
    });

    const emailToken = jwt.sign(
      {
        user: savedUser._id,
      },
      process.env.JWT_ACTIVATE_ACC,
      {
        expiresIn: "1d",
      }
    );

    const url = `http://localhost:5000/confirmation/${emailToken}`;

    transporter.sendMail({
      from: "Moments <momentsorbital@gmail.com>",
      to: lowerCaseEmail,
      subject: "Confirmation Email",
      html: `Almost done, ${name}! To complete your Moments registration, we just need you to verify your email address: <br><br>

      Please click the following link to verify your email address: <a href="${url}">${url}</a> <br><br>

      Once verified, you can start using all of Moment's features. <br><br>
      
      You’re receiving this email because you recently created a new Moments account. If this wasn’t you, please ignore this email. <br><br>
      Thanks, <br>
      The Moments Team`,
    });

    res.send("");
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

// log in
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const lowerCaseEmail = email.toLowerCase();

    // validate
    if (!email || !password) {
      return res
        .status(400)
        .json({ errorMessage: "Please enter all required fields." });
    }

    const existingUser = await User.findOne({ email: lowerCaseEmail });

    if (!existingUser) {
      return res.status(401).json({ errorMessage: "Wrong email or password." });
    }

    if (!existingUser.confirmed) {
      return res
        .status(401)
        .json({ errorMessage: "Please verify your email to login" });
    }

    const passwordCorrect = await bcrypt.compare(
      password,
      existingUser.passwordHash
    );

    if (!passwordCorrect) {
      return res.status(401).json({ errorMessage: "Wrong email or password." });
    }

    // sign token
    const token = jwt.sign(
      {
        user: existingUser._id,
      },
      process.env.JWT_SECRET
    );

    // send token in a HTTP-only cookie
    res
      .cookie("token", token, {
        httpOnly: true,
      })
      .send();
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

// log out
router.get("/logout", (req, res) => {
  res
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
    })
    .send();
});

// logged in
router.get("/loggedIn", (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.json(false);

    jwt.verify(token, process.env.JWT_SECRET);

    res.send(true);
  } catch (err) {
    res.json(false);
  }
});

// send reset-password link
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const lowerCaseEmail = email.toLowerCase();

    const existingUser = await User.findOne({ email: lowerCaseEmail });

    if (!existingUser) {
      return res
        .status(401)
        .json({ errorMessage: "User with this email does not exist" });
    }

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_SENDER, // generated ethereal user
        pass: process.env.EMAIL_PASS, // generated ethereal password
      },
    });

    const emailToken = jwt.sign(
      {
        user: existingUser._id,
      },
      process.env.JWT_RESET_PASS,
      {
        expiresIn: "20m",
      }
    );

    const url = `http://localhost:3000/reset-password/${emailToken}`;

    const forgotpass = "http://localhost:3000/forgot-password";

    transporter.sendMail({
      from: "Moments <momentsorbital@gmail.com>",
      to: lowerCaseEmail,
      subject: "Reset Password Email",
      html: `We heard that you lost your Moments password. Sorry about that! <br><br>

      But don’t worry! You can use the following link to reset your password: <br><br>

      Please click this email to reset your password: <a href="${url}">${url}</a> <br><br>
      If you don’t use this link within 20 minutes, it will expire. To get a new password reset link, visit <a href="${forgotpass}">${forgotpass}</a> <br><br>

      Thanks, <br>
      The Moments Team`,
    });

    await User.updateOne({ email: lowerCaseEmail }, { resetToken: emailToken });

    res.send("");
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

// Deal with reset-password link
router.post("/reset-password", async (req, res) => {
  try {
    const { newPassword, token } = req.body;
    jwt.verify(token, process.env.JWT_RESET_PASS, (err, decodedData) => {
      if (err) {
        res.redirect("http://localhost:3000/forgot-password");
        return res.status(401).json({
          errorMessage: "Reset Link has expired, please resend email again",
        });
      }
    });

    const changedUser = await User.findOne({ resetToken: token });

    if (!changedUser) {
      return res
        .status(401)
        .json({ errorMessage: "User with this token does not exist" });
    }

    // encrypt (hash) password
    const salt = await bcrypt.genSalt();
    const newPasswordHash = await bcrypt.hash(newPassword, salt);

    await User.updateOne(
      { resetToken: token },
      { passwordHash: newPasswordHash, resetToken: "" }
    );

    res.send("");
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

module.exports = router;
