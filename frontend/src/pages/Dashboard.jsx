import { Button, Stack, Typography, AppBar, Toolbar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthContext();

  return (
    <>
      <AppBar position="static">
        <Toolbar className="flex justify-between">
          <Typography variant="h6">Dashboard</Typography>
          <Stack direction="row" spacing={2}>
            <Button color="inherit" onClick={() => navigate("/employees")}>Employees</Button>
            <Button color="inherit" onClick={() => navigate("/manage")}>Manage</Button>
            <Button color="inherit" onClick={logout}>Logout</Button>
          </Stack>
        </Toolbar>
      </AppBar>
      <Stack spacing={2} alignItems="center" sx={{ mt: 5 }}>
        <Typography variant="h4">Welcome, {user?.name || "User"}</Typography>
      </Stack>
    </>
  );
}
