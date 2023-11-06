const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const port = 5000;

const { connect, Schema, model } = require("mongoose");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db =
  "mongodb+srv://muhammedAslam:aslam%4012345@cluster0.q2awiej.mongodb.net/db_testing";

app.listen(port, async () => {
  console.log("server is running");
  try {
    await connect(db);
    console.log("db connection established");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
});

//model district
const districtSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  username: {
    type: String,
    required: false,
  },
});
const District = model("district", districtSchema);

app.post("/District", async (req, res) => {
  const { name, phone, username } = req.body;

  district = new District({
    name,
    phone,
    username,
  });

  await district.save();

  res.json({ message: "District and phone inserted successfully" });
});

const employeeDetails = new Schema({
  employeeName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  place: {
    type: String,
    required: true,
  },
  district: {
    type: String,
    required: true,
  },
  designation:{
    type:String,
    required:true,
  },
});

const employee = model("employeeDetails", employeeDetails);

app.post("/employee", async (req, res) => {
  const { employeeName, address, phone, place, district,designation } = req.body;

  employeevalues = new employee({
    employeeName,
    address,
    phone,
    place,
    district,
    designation,
  });

  await employeevalues.save()

  res.json({ message: "employee details successfully inserted" });
});
