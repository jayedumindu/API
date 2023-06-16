const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

// configuration
var app = express();
app.use(express.json());
dotenv.config();

const mongoString = process.env.DATABASE_URL;
const hostname = "127.0.0.1";
const port = 3000;

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
  email: {
    required: true,
    type: String,
  },
  avatar: {
    type: String
  },
  name : {
    type: String
  }
})

const meetingSchema = new mongoose.Schema({
  id: {
    required: true,
    type: String,
    unique : true
  },
  host: {
    type : String,
    required: true, 
  },
  users:[userSchema],
  startTime: {
    type: Date,
  },
  endTime: Date,
  messages: [{body: String, timeStamp: Date}]
});

const userModel = mongoose.model("User", userSchema);
const meetingModel = mongoose.model("Meeting", meetingSchema);

// ------------------------------------ API -----------------------------

// sendFile will go here
app.get("/", function (req, res) {
  
});

app.get("/getAllMeetings", async function (req, res) {
  try {
    const data = await meetingModel.find({ host: req.query.hostId });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/getMeeting", async function (req, res) {
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
app.delete("/deleteAll", async function (req, res) {
  try {
    const data = await meetingModel.deleteMany({host : req.query.hostId})
  } catch (error) {
    
  }
})

app.post("/saveUser", async function (req, res) {
  let { email, avatar, name } = req.body;
  let user = new userModel({
    name: name,
    email: email,
    avatar: avatar,
  });
  try {
    const dataToSave = await user.save();
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete("/delUser", async function (req, res) {
  try {
    const dataToBeDeleted = await userModel.findOneAndRemove({
      email: req.body.email,
    });
    res.status(200).json(dataToBeDeleted);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
