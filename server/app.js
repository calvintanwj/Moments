const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(
  cors({
    // origin: ["http://localhost:3000"],
    origin: ["https://moments-flax.vercel.app"],
    credentials: true,
  })
);

// Connecting MongoDB
// =========================================================================================================
mongoose.connect(
  process.env.MDB_CONNECT,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
  (err) => {
    if (err) return console.error(err);
    console.log("Connected to DB");
  }
);

// User Authentication Route
// =========================================================================================================
app.use("/auth", require("./routers/userRouter"));

// Confirmation Route
// =========================================================================================================
app.use("/confirmation", require("./routers/confirmationRouter"));

// Confirmation Route
// =========================================================================================================
app.use("/update", require("./routers/updateRouter"));

app.get("/", (req, res) => {
  res.send("Hello from Express!");
});
