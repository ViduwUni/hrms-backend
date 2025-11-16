import Employee from "../models/Employee.js";

// Create Employee
export const createEmployee = async (req, res) => {
  try {
    const { employeeNumber, name, phone } = req.body;

    // Check if employee number already exists
    const existing = await Employee.findOne({ employeeNumber });
    if (existing)
      return res
        .status(400)
        .json({ message: "Employee number already exists" });

    const employee = await Employee.create({ employeeNumber, name, phone });

    res.status(201).json(employee); // createdAt is included automatically
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get All Employees (sorted by newest first)
export const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 }); // newest first
    res.json(employees); // includes createdAt
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Employee by ID
export const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });

    res.json(employee); // includes createdAt
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Employee
export const updateEmployee = async (req, res) => {
  try {
    const { employeeNumber, name, phone } = req.body;

    // Check if another employee already has the same employeeNumber
    const existing = await Employee.findOne({
      employeeNumber,
      _id: { $ne: req.params.id },
    });
    if (existing)
      return res
        .status(400)
        .json({ message: "Employee number already exists" });

    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      { employeeNumber, name, phone },
      { new: true } // return the updated document
    );

    if (!updatedEmployee)
      return res.status(404).json({ message: "Employee not found" });

    res.json(updatedEmployee); // includes createdAt
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete Employee
export const deleteEmployee = async (req, res) => {
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
    if (!deletedEmployee)
      return res.status(404).json({ message: "Employee not found" });

    res.json({ message: "Employee deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
