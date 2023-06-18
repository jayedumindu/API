const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");

// configuration
var app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);
dotenv.config();

const mongoString = process.env.DATABASE_URL;
const hostname = "127.0.0.1";
const port = 6500;

app.listen(port, function () {
  console.log("Express-App listening at http://%s:%s", hostname, port);
  console.log(mongoString);
});

// connecting to the database
mongoose.set("strictQuery", true);
mongoose.connect(mongoString);
const database = mongoose.connection;

database.on("error", (error) => {
  console.log(error);
});

database.once("connected", () => {
  console.log("Database Connected");
});

const userSchema = new mongoose.Schema({
  _id: {
    required: true,
    type: String,
  },
  avatar: {
    type: String,
  },
  name: {
    type: String,
  },
});

const meetingSchema = new mongoose.Schema({
  peerId: {
    required: true,
    type: String,
    unique: true,
  },
  host: {
    type: String,
    required: true,
  },
  users: [{ type: userSchema }],
  startTime: {
    type: Date,
  },
  endTime: Date,
  messages: [{ type: mongoose.Schema.Types.Mixed }],
});

const userModel = mongoose.model("User", userSchema);
const meetingModel = mongoose.model("Meeting", meetingSchema);

// ------------------------------------ requests -----------------------------

app.post("/save/meeting", async function (req, res) {
  try {
    console.log("req awa");
    let user = new meetingModel(req.body);
    const dataToSave = await user.save();
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// return all meetings for a specific host
app.get("/getAll/meeting", async function (req, res) {
  try {
    const data = await meetingModel.find({ host: req.query.hostId });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// data about a single meeting
app.get("/get/meeting", async function (req, res) {
  try {
    const data = await meetingModel.find({
      id: req.query.meetingId,
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// delete all records for a specific host
app.delete("/delAll/meeting", async function (req, res) {
  try {
    const data = await meetingModel.deleteMany({ host: req.query.hostId });
    res.json({ success: data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/save/user", async function (req, res) {
  try {
    console.log("user-save ekt awaaaa");
    // search if exists
    let user = new userModel(req.body);
    let result = await userModel.findById(req.body._id).exec();
    console.log(result);
    if (result == null) {
      user.save(req.body).then((res) => {
        res.status(200).json({ message: "succesull!", data: res.data });
      });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete("/del/user", async function (req, res) {
  try {
    const dataToBeDeleted = await userModel.findOneAndRemove({
      email: req.body.email,
    });
    res.status(200).json(dataToBeDeleted);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
