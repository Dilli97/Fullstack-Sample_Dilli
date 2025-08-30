import React, { useState } from "react"
import {
  Grid,
  Card,
  CardHeader,
  CardContent,
  Box,
  TextField,
  Button,
  Alert,
  MenuItem,
} from "@mui/material"
import { useNavigate } from "react-router-dom"
import { useAuthContext } from "../context/AuthContext";

export default function Register() {
  const navigate = useNavigate()
  const { register, loading, error, setError } = useAuthContext()
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "" })

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    try {
      await register(form)
      navigate("/dashboard")
    } catch {
      // error already handled in hook
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-100 via-indigo-200 to-purple-200 px-4">
    
    <Grid container justifyContent="center">
      <Grid item xs={12} sm={8} md={6} lg={5}>
        <Card>
          <CardHeader title="Register"   align="center"  />
          <CardContent>
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ display: "grid", gap: 2 }}
            >
              {error && <Alert severity="error">{error}</Alert>}

              <TextField
                label="Full Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                fullWidth
                required
              />
              <TextField
                label="Email"
                name="email"
                value={form.email}
                onChange={handleChange}
                type="email"
                fullWidth
                required
              />
              <TextField
                label="Password"
                name="password"
                value={form.password}
                onChange={handleChange}
                type="password"
                fullWidth
                required
              />

              {/* New Role Dropdown */}
              <TextField
                select
                label="Role"
                name="role"
                value={form.role}
                onChange={handleChange}
                fullWidth
                required
              >
                <MenuItem value="admin">Admin</MenuItem>
<MenuItem value="manager">Manager</MenuItem>

              </TextField>

              <Button type="submit" variant="contained" disabled={loading}>
                {loading ? "Creating…" : "Register"}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
    </div>
  )
}
