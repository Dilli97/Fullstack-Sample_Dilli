import express from "express"
import Employee from "../models/Employee.js"
import { authMiddleware } from "../middleware/authMiddleware.js"

const router = express.Router()
router.use(authMiddleware)

// Get all employees
router.get("/", async (req, res) => {
  const employees = await Employee.find()
  res.json(employees)
})

// Add employee
router.post("/", async (req, res) => {
  const employee = new Employee(req.body)
  await employee.save()
  res.json(employee)
})

// Update employee
router.put("/:id", async (req, res) => {
  const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true })
  res.json(employee)
})

// Delete employee
router.delete("/:id", async (req, res) => {
  await Employee.findByIdAndDelete(req.params.id)
  res.json({ message: "Employee deleted" })
})

export default router
