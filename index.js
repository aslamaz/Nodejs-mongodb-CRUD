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
    console.log("server is Running");
    try {
        await connect(db)
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

const PlaceSchema = new Schema({
    Place: {
        type: String,
        required: true,
    },
    district_id: {
        type: Schema.Types.ObjectId,
        ref: "District", // Make sure this matches your District model name
        required: true,
    }
});
const modelPlaces = model("PlaceShema", PlaceSchema);

const EmployeeShema = new Schema({
    employeeName: {
        type: String,
        required: true,
    },
    designation: {
        type: String,
        required: true,
    },
    company: {
        type: String,
        required: true,
    },
    place: {
        type: Schema.Types.ObjectId,
        ref: "PlaceShema", // Make sure this matches your District model name
        required: true,
    },
    mobile: {
        type: Number,
        required: true,
    }
});
const modelEmployee = model("EmployeeShema", EmployeeShema);





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
      await District.findByIdAndDelete(req.params.id);
      res.json({ msg: "District removed" });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  });
  

app.post("/Postplaces", async (req, res) => {
    try {
        const { Place, district_id } = req.body;
        newPlace = new modelPlaces({
            Place,
            district_id,
        })
        await newPlace.save();
        res.json(newPlace);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

app.get("/getplaces", async (req, res) => {
    try {
        const places = await modelPlaces.find();
        res.json(places)
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

app.put("/updatePlace/:id", async (req, res) => {
    const id = req.params.id
    try {
        const { Place, district_id } = req.body;

        const updatedPlace = await modelPlaces.findByIdAndUpdate(
            id,
            { Place, district_id },
            { new: true }
        );
        res.json(updatedPlace)
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

app.delete("/delPlaces/:id", async (req, res) => {
    const id = req.params.id
    try {
        await modelPlaces.findByIdAndDelete(id);
        res.json({ msg: "place removed" })
    } catch (error) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

app.get("/places", async (req, res) => {
    try {
        const Places = await modelPlaces.find().populate("district_id");

        const filteredPlaces = Places.filter(
            (Place) => Place.district_id
        );

        res.json(filteredPlaces);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }

});

app.get("/placeWithdistrict/:id",async(req,res)=>{
    const id = req.params.id;
    try {
        const districtId = id;
        const place = await modelPlaces.find({district_id:districtId});
        if(place.length === 0){
        return res.status(404).json({msg:"no place found"});
        }
        res.json(place).status(200);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
})


//employee details db....................................

app.post("/insertEmployee", async (req, res) => {
    try {
        const { employeeName, designation, company, place, mobile } = req.body;
        newEmployee = new modelEmployee({
            employeeName,
            designation,
            company,
            place,
            mobile,
        })
        await newEmployee.save();
        res.json(newEmployee);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

app.get("/getEmployee", async (req, res) => {
    try {
        const employees = await modelEmployee.find();
        res.json(employees)
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

app.put("/updateEmployee/:id", async (req, res) => {
    const id = req.params.id
    try {
        const { employeeName, designation, company, place, mobile } = req.body;
        const updateemployee = await modelEmployee.findByIdAndUpdate(
            id,
            { employeeName, designation, company, place, mobile }, { new: true }
        );
        res.json(updateemployee);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

app.delete("/delEmployee/:id", async (req, res) => {
    const id = req.params.id
    try {
        await modelEmployee.findByIdAndDelete(id);
        res.json({ msg: "removed employee" })
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

app.get("/employees", async (req, res) => {
    try {
        const employees = await modelEmployee.find().populate({
            path: 'place',
            populate: {
                path: 'district_id',
                model: 'District',
            }
        });
        
        const filteredEmployees = employees.filter(employee => employee.place && employee.place.district_id);

        res.json(filteredEmployees);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});


app.get("/EmployeeWithPlace/:placeid",async(req,res)=>{
    const id = req.params.placeid;
    try {
        const placeId = id;
        const place = await modelEmployee.find({place:placeId});
        if(place.length === 0){
        return res.status(404).json({msg:"no employee found"});
        }
        res.json(place).status(200);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
})

app.get("/employeesWithDistrict/:districtId", async (req, res) => {
    const districtId = req.params.districtId;
    try {
        // Find places with the specified district_id
        const places = await modelPlaces.find({ district_id: districtId });

        // If no places found, return an appropriate response
        if (places.length === 0) {
            return res.status(404).json({ msg: "No places found for the given district_id" });
        }

        // Extract place IDs from the found places
        const placeIds = places.map(place => place._id);

        // Find employees whose place ID is in the extracted list
        const employees = await modelEmployee.find({ place: { $in: placeIds } })
            .populate({
                path: 'place',
                populate: {
                    path: 'district_id',
                    model: 'District',
                }
            });

        // If no employees found, return an appropriate response
        if (employees.length === 0) {
            return res.status(404).json({ msg: "No employees found for the given district_id" });
        }

        res.json(employees);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});


