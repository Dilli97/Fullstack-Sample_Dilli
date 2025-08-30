import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Card, CardHeader, CardContent, TextField, Button, Alert, Box, Typography } from "@mui/material";
import { useAuthContext } from "../context/AuthContext";

export default function Login() {
  const { login, loading, error, setError } = useAuthContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationError, setValidationError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setValidationError("");

    // Simple validation
    if (!email) {
      setValidationError("Email is required");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setValidationError("Enter a valid email address");
      return;
    }
    if (!password) {
      setValidationError("Password is required");
      return;
    }
    if (password.length < 6) {
      setValidationError("Password must be at least 6 characters");
      return;
    }

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      // error handled in context
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-100 via-indigo-200 to-purple-200 px-4">
      <Typography 
        variant="h4" 
        align="center" 
        className="font-bold text-indigo-900 mb-6"
      >
        Employee Management System
      </Typography>

      <Grid container justifyContent="center">
        <Grid item xs={12} sm={8} md={6} lg={5}>
          <Card className="shadow-xl rounded-2xl">
            <CardHeader 
              title="Login" 
              className="text-center text-lg font-bold bg-indigo-600 text-white rounded-t-2xl" 
            />
            <CardContent>
              <Box component="form" sx={{ display: "grid", gap: 2 }} onSubmit={handleSubmit}>
                {validationError && <Alert severity="warning">{validationError}</Alert>}
                {error && <Alert severity="error">{error}</Alert>}
                <TextField 
                  label="Email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  fullWidth 
                  required 
                />
                <TextField 
                  label="Password" 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  fullWidth 
                  required 
                />
                <Button 
                  type="submit" 
                  variant="contained" 
                  disabled={loading} 
                  fullWidth
                >
                  {loading ? "Signing in…" : "Login"}
                </Button>
                <Button 
                  variant="outlined" 
                  fullWidth 
                  onClick={() => navigate("/register")}
                >
                  Create Account
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
