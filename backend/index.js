import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import { MONGODB_URL, PORT } from "./config.js"
import authRoutes from "./routes/authRoutes.js"
import employeeRoutes from "./routes/employeeRoutes.js"
import taskRoutes from "./routes/taskRoutes.js"

const app = express()
app.use(cors())
app.use(express.json())

app.use("/api/auth", authRoutes)   
app.use("/api/employees", employeeRoutes) 
app.use("/api/tasks", taskRoutes)     

// DB

mongoose
  .connect(MONGODB_URL)
  .then(() => {
    console.log("MongoDB connected:")
    app.listen(PORT, () => console.log(` Server running on ${PORT}`))
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message)
  })