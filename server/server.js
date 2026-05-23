const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/hrms")
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log(err);
  });

// Schema
const employeeSchema = new mongoose.Schema({
  name: String,
  department: String,
  email: String,
  phone: String,
  role: String,
  joiningDate: String,
  status: String,
});

// Model
const Employee = mongoose.model(
  "Employee",
  employeeSchema
);

// GET Employees
app.get("/employees", async (req, res) => {

  const employees =
    await Employee.find();

  res.json(employees);

});

// ADD Employee
app.post("/employees", async (req, res) => {

  const employee =
    new Employee(req.body);

  await employee.save();

  res.json(employee);

});

// UPDATE Employee
app.put("/employees/:id", async (req, res) => {

  const updatedEmployee =
    await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

  res.json(updatedEmployee);

});

// DELETE Employee
app.delete("/employees/:id", async (req, res) => {

  await Employee.findByIdAndDelete(
    req.params.id
  );

  res.json({
    message: "Deleted",
  });

});

// SERVER
app.listen(5000, () => {

  console.log(
    "Server running on port 5000"
  );

});