const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { connect, Schema, model } = require("mongoose");

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = "mongodb+srv://muhammedAslam:aslam%4012345@cluster0.q2awiej.mongodb.net/db_testing";

app.listen(port, async () => {
  console.log("Server is running");
  try {
    await connect(db);
    console.log("DB connection established");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
});

const districtSchema = new Schema({
    name: {
      type: String,
      required: true,
    }
  });
  

// Define District model based on districtSchema
const District = model("District", districtSchema);

// Create Operation
app.post("/districts", async (req, res) => {
  try {
    const { name } = req.body;
    const newDistrict = new District({ name });
    await newDistrict.save();
    res.json(newDistrict);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Read Operation
app.get("/districts", async (req, res) => {
  try {
    const districts = await District.find();
    res.json(districts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Update Operation
app.put("/districts/:id", async (req, res) => {
  try {
    const { name } = req.body;
    const updatedDistrict = await District.findByIdAndUpdate(req.params.id, { name }, { new: true });
    res.json(updatedDistrict);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Delete Operation
app.delete("/districts/:id", async (req, res) => {
  try {
    await District.findByIdAndRemove(req.params.id);
    res.json({ msg: "District removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
