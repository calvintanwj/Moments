const router = require("express").Router();
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/userModel");

// Deal with confirmation email
router.get("/:token", async (req, res) => {
  try {
    const verify = jwt.verify(req.params.token, process.env.JWT_ACTIVATE_ACC);
    await User.findOneAndUpdate({ _id: verify.user }, { confirmed: true });
    res.redirect("http://localhost:3000/verified");
  } catch (err) {
    res.redirect("http://localhost:3000/expired");
  }
});

// Deal with Expired Email
router.post("/resend", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res
      .status(400)
      .json({ errorMessage: "Please enter all required fields." });
  }

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: "Gmail",
    
  });

  const existingUser = await User.findOne({ email });

  const emailToken = jwt.sign(
    {
      user: existingUser._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );

  const url = `http://localhost:5000/confirmation/${emailToken}`;

  transporter.sendMail({
    from: "Moments",
    to: email,
    subject: "Confirm Email",
    html: `Please click this email to confirm your email: <a href="${url}">${url}</a>`,
  });

  res.send("");
});

module.exports = router;
