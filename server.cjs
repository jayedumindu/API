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

// creating customer model

const customerSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
  },
  email: {
    required: true,
    type: String,
    unique: true,
    lowercase: true,
  },
  age: {
    required: true,
    type: Number,
  },
});
const customerModel = mongoose.model("Customers", customerSchema);

// ------------------------------------ API -----------------------------

// sendFile will go here
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/getAllCustomers", async function (req, res) {
  try {
    const data = await customerModel.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/getCustomer", async function (req, res) {
  try {
    const data = await customerModel.find({
      email: req.query.email,
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/saveCustomer", async function (req, res) {
  let { name, email, age } = req.body;
  let customer = new customerModel({
    name: name,
    email: email,
    age: age,
  });
  try {
    const dataToSave = await customer.save();
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete("/delCustomer", async function (req, res) {
  try {
    const dataToBeDeleted = await customerModel.findOneAndRemove({
      email: req.query.email,
    });
    res.status(200).json(dataToBeDeleted);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
