import express from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../models/User.js"

const router = express.Router()

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: "All fields are required" })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) return res.status(400).json({ error: "Email already exists" })

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = new User({ name, email, password: hashedPassword, role })
    await newUser.save()

    res.status(201).json({ message: "User registered successfully" })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Server error" })
  }
})

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ error: "Invalid credentials" })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" })

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    )

    res.json({ token, user: { id: user._id, name: user.name, role: user.role } })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Server error" })
  }
})

export default router
