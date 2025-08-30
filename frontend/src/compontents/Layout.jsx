import React from 'react'
import { AppBar, Toolbar, Typography, IconButton, Container, Box, Button } from '@mui/material'
import { Menu as MenuIcon } from '@mui/icons-material'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'


export default function Layout({ children }) {
const { user, logout } = useAuth()
return (
<Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
<AppBar position="sticky">
<Toolbar>
<IconButton edge="start" color="inherit" sx={{ mr: 2 }}>
<MenuIcon />
</IconButton>
<Typography variant="h6" sx={{ flexGrow: 1 }}>EMS</Typography>
{user ? (
<>
<Button color="inherit" component={Link} to="/">Employees</Button>
<Button color="inherit" component={Link} to="/tasks">Tasks</Button>
<Button color="inherit" onClick={logout}>Logout</Button>
</>
) : (
<>
<Button color="inherit" component={Link} to="/login">Login</Button>
<Button color="inherit" component={Link} to="/register">Register</Button>
</>
)}
</Toolbar>
</AppBar>
<Container maxWidth="lg" sx={{ py: 3 }}>{children}</Container>
</Box>
)
}