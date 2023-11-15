const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const port = 5000;

const { connect, Schema, model } = require("mongoose");

const app = express();

app.use(cors());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ extended: true }))
app.use(express.urlencoded({ extended: true }));


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

//model employee
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
  designation: {
    type: String,
    required: true,
  },
});

const employee = model("employeeDetails", employeeDetails);

//model place
const PlaceSchema = new Schema({
  place: {
    type: String,
    required: true,
  },
  district_Id: {
    type: Schema.Types.ObjectId,
    ref: "district", // Make sure this matches your District model name
    required: true,
  },
});

const Places = model("PlaceSchema", PlaceSchema);

//model student
const studentinfo = new Schema({
  name: {
    type: String,
    required: true,
  },
  department: {
    type: String,
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
  phone: {
    type: Number,
    required: true,
  },
  studentId: {
    type: String,
    required: true,
  },
});

const studentDetails = model("studentinfo", studentinfo);

const category = new Schema({
 
  wheeltype:{
    type:String,
    required:true,
  },
  
});

const sizeCategory =model("category", category);

const subcategory = new Schema({
  category_id:{
    type:String,
    required: true,
  },
  vehicle:{
    type:String,
    required:true,
  }
});

const subcategoryVehicles = model("subCategory", subcategory)

const Department = new Schema({
  departmentName:{
    type:String,
    required:true,
  }
})
const Dep = model("department",Department);

const Batch =new Schema({
  dep_id:{
    type:String,
    required:true,
  },
  batchName:{
    type:String,
    required:true,
  }
})
const collectionBatch=model("Batch",Batch);

app.get("/getDepartment", async (req, res) => {
  let details = await Dep.find();
  res.send(details).status(200);
});

app.post("/Department",async (req,res)=>{
  const{departmentName}=req.body

  docDep=new Dep({
    departmentName
  })
  await docDep.save();

  res.json({message:"dep name inserted successfully"})
});

app.post("/Batch",async(req,res)=>{
  const{dep_id,batchName}=req.body

  docBatch =new collectionBatch({
    dep_id,
    batchName
  })
  await docBatch.save();

  res.json({message:"batch successfully inserted"})
});

app.get("/getBatch", async (req, res) => {
  let details = await collectionBatch.find();
  res.send(details).status(200);
});

app.delete("/delBatch/:id", async (req, res) => {
  try {
    const BatchId = req.params.id;

    const deletedBatch = await Places.findByIdAndDelete(BatchId);

    if (!deletedBatch) {
      return res.status(404).json({ message: "State not found" });
    }

    res.json({ message: "category deleted successfully", deletedBatch });
  } catch (err) {
    console.error("Error deleting batch:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.put("/DistrictPut", async (req, res) => {
  const { name, phone, username ,id } = req.body;

  try {
    // Update the district fields
    const updateDoc = {
      $set: {
        name: name,
        phone: phone,
        username: username,
      },
    };

    // Find the district by ID and update
    const updatedDistrict = await District.findByIdAndUpdate(id, updateDoc, { new: true });

    // If the district is not found, return an error response
    if (!updatedDistrict) {
      return res.status(404).json({ message: "District not found" });
    }

    res.json({ message: "District updated successfully", district: updatedDistrict });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});



app.post("/category", async (req,res)=>{
  const{wheeltype}=req.body;

  categories=new sizeCategory({
    wheeltype
  })
  await categories.save();

  res.json({message: "category inserted successfully"})
});



app.delete("/category/:id", async (req, res) => {
  try {
    const categoryId = req.params.id;

    const deletedPlace = await Places.findByIdAndDelete(categoryId);

    if (!deletedPlace) {
      return res.status(404).json({ message: "State not found" });
    }

    res.json({ message: "category deleted successfully", deletedPlace });
  } catch (err) {
    console.error("Error deleting district:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/vehicles", async(req,res)=>{


  const{category_id,vehicle}=req.body

  subcaregories=new subcategoryVehicles({
    category_id,
    vehicle,
    
  });
  await subcaregories.save();

  res.json({message: "vehicles inserted successfully"})
});

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

app.post("/employee", async (req, res) => {
  const { employeeName, address, phone, place, district, designation } =
    req.body;

  employeevalues = new employee({
    employeeName,
    address,
    phone,
    place,
    district,
    designation,
  });

  await employeevalues.save();

  res.json({ message: "employee details successfully inserted" });
});

app.post("/Place", async (req, res) => {
  const { place, district_Id } = req.body;

  placeDeatils = new Places({
    place,
    district_Id,
  });

  await placeDeatils.save();

  res.json({ message: "place successfully inserted" });
});

app.post("/studentinfo", async (req, res) => {
  const { name, department, place, district, phone, studentId } = req.body;

  students = new studentDetails({
    name,
    department,
    place,
    district,
    phone,
    studentId,
  });
  await students.save();

  res.json({ message: "student details successfuly inserted " });
});


//get employee
app.get("/employee", async (req, res) => {
  let details = await employee.find();
  res.send(details).status(200);
});

//get district
app.get("/District", async (req, res) => {
  let district = await District.find();
  res.send(district).status(200);
});

app.get("/District/getOne", async (req, res) => {
  let district = await District.findOne({ username: "abcd" });
  res.send(district).status(200);
});

//get student
app.get("/Getstudentinfo", async (req, res) => {
  let students = await studentDetails.find();
  res.send(students).status(200);
});

app.get("/GetOneStudentinfo", async (req, res) => {
  let students = await studentDetails.findOne({ department: "automobile" });
  res.send(students).status(200);
});

//delete place
app.delete("/Place/:id", async (req, res) => {
  try {
    const placeId = req.params.id;
    console.log(placeId);

    const deletedPlace = await Places.findByIdAndDelete(placeId);

    if (!deletedPlace) {
      return res.status(404).json({ message: "State not found" });
    }

    res.json({ message: "Place deleted successfully", deletedPlace });
  } catch (err) {
    console.error("Error deleting district:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

//delete student
app.delete("/studentinfo/:~", async (req, res) => {
  try {
    const studentName = req.params.name;
    const deleteStudent = await studentDetails.findByNameAndDelete(studentName);
    if (!deleteStudent) {
      return res.status(404).json({ message: "student not found" });
    }
    res.json({ message: "student deleted succesfully", deleteStudent });
  } catch (err) {
    console.error("Error deleting district:", err);
    res.status(500).json({ message: "internal server error" });
  }
});

//get places using where condition
app.get("/Place/:id", async (req, res) => {
  try {
    console.log('hi');

    const districtId = req.params.id;
    console.log(districtId);
    const place = await Places.find({ district_Id: districtId });
    if (place.length === 0) {
      return res.status(404).json({ message: "Place not found" });
    }
    res.send(place).status(200);
  } catch (err) {
    console.error("Error deleting state:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

//get student using where condition
app.get("/Studentinfo/:name", async (req, res) => {
  try {
    const studentName = req.params.name;
    const student = await studentDetails.find({ name: studentName });
    if (student.length === 0) {
      return res.status(404).json({ message: "student not found" });
    }
    res.send(student).status(200);
  } catch (err) {
    console.error("Error deleting state:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// get places with inner join on district
app.get("/Place", async (req, res) => {

  try {
    const placesWithDistrict = await Places.find()
      .populate({
        path: "district_Id",
        model: "district", // Make sure this matches your District model name
      })
      .exec();

    // Filter out places without a valid district
    const filteredPlaces = placesWithDistrict.filter(
      (place) => place.district_Id
    );

    res.send(filteredPlaces).status(200);
    
  } catch (err) {
    console.error("Error getting places with district:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get(("/vehicles", async (req,res)=>{
  console.log('hi');
  try {
    const wheelSizeWithVehicle = await subcategoryVehicles.find()
      .populate({
        path: "category_id",
        model: "category", // Make sure this matches your District model name
      })
      .exec();

    // Filter out places without a valid district
    const filteredCategory = wheelSizeWithVehicle.filter(
      (subcategoryVehicles) => subcategoryVehicles.category_id
    );

    res.send(filteredCategory).status(200);
    
  } catch (err) {
    console.error("Error getting vehicle with wheels:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}))


app.delete('/District/:id', async (req, res) => {
  try {
    const districtId = req.params.id

    const deletedCategory = await District.findByIdAndDelete(districtId)

    if (!deletedCategory) {
      return res.status(404).json({ message: 'Category not found' })
    }

    res.json({ message: 'Category deleted successfully', deletedCategory })
  } catch (err) {
    console.error('Error deleting Category:', err)
    res.status(500).json({ message: 'Internal server error' })
  }
});







