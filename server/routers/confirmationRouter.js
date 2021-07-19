const router = require("express").Router();
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/userModel");

// Deal with confirmation email
router.get("/:token", async (req, res) => {
  try {
    const verify = jwt.verify(req.params.token, process.env.JWT_ACTIVATE_ACC);
    await User.findOneAndUpdate({ _id: verify.user }, { confirmed: true });
    // res.redirect("http://localhost:3000/verified");
    res.redirect("https://moments-flax.vercel.app/verified");
  } catch (err) {
    // res.redirect("http://localhost:3000/expired");
    res.redirect("https://moments-flax.vercel.app/expired");
  }
});

// Deal with Expired Email
router.post("/resend", async (req, res) => {
  const { email } = req.body;
  const lowerCaseEmail = email.toLowerCase();

  if (!email) {
    return res
      .status(400)
      .json({ errorMessage: "Please enter all required fields" });
  }

  var emailFormat = /^\S+@\S+\S+$/;

  if (!email.match(emailFormat)) {
    return res.status(400).json({
      errorMessage: "Please enter a valid email",
    });
  }

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_SENDER, // generated ethereal user
      pass: process.env.EMAIL_PASS, // generated ethereal password
    },
  });

  const existingUser = await User.findOne({ email: lowerCaseEmail });

  const emailToken = jwt.sign(
    {
      user: existingUser._id,
    },
    process.env.JWT_ACTIVATE_ACC,
    {
      expiresIn: "1d",
    }
  );

  // const url = `http://localhost:5000/confirmation/${emailToken}`;
  const url = `https://momentsorbital.herokuapp.com/confirmation/${emailToken}`;

  transporter.sendMail({
    from: "Moments <momentsorbital@gmail.com>",
    to: lowerCaseEmail,
    subject: "Confirmation Email",
    html: `Almost done! To complete your Moments registration, we just need you to verify your email address: <br><br>

    Please click the following link to verify your email address: <a href="${url}">${url}</a> <br><br>

    Once verified, you can start using all of Moment's features. <br><br>
    
    You’re receiving this email because you recently created a new Moments account. If this wasn’t you, please ignore this email. <br><br>
    Thanks, <br>
    The Moments Team`,
  });

  res.status(200).send();
});

module.exports = router;
