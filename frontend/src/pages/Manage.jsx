import React, { useEffect, useState } from 'react';
import {
  AppBar, Toolbar, Stack, Button, Card, CardHeader, CardContent,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Chip, Tooltip, TextField, Select, MenuItem,Typography
} from '@mui/material';
import { Delete, Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuthContext } from '../context/AuthContext';

export default function Manage() {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', employeeId: '', status: 'Pending' });

  const navigate = useNavigate();
  const { user, logout } = useAuthContext();

  // Fetch employees
  const fetchEmployees = async () => {
    try {
      const { data } = await api.get('/employees');
      setEmployees(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const { data } = await api.get('/tasks');
      setTasks(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchTasks();
  }, []);

  const handleAddTask = async () => {
    if (!newTask.title || !newTask.employeeId) return;
    try {
      const { data } = await api.post(`/tasks/employee/${newTask.employeeId}`, newTask);
      setTasks([data, ...tasks]);
      setNewTask({ title: '', employeeId: '', status: 'Pending' });
    } catch (err) {
      console.error(err);
    }
  };

  const toggleStatus = async (task) => {
    try {
      const updated = await api.put(`/tasks/${task._id}`, {
        ...task,
        status: task.status === 'Pending' ? 'Completed' : 'Pending'
      });
      setTasks(tasks.map(t => t._id === task._id ? updated.data : t));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter(t => t._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 via-indigo-200 to-purple-200 p-4">
      
      {/* AppBar */}
      <AppBar position="static" className="mb-4">
  <Toolbar>
     <Typography variant="h6">EMS Dashboard</Typography>
    <Stack direction="row" spacing={2} className="ml-auto">
      <Button color="inherit" onClick={() => navigate("/employees")}>Employees</Button>
      <Button color="inherit" onClick={() => navigate("/manage")}>Manage</Button>
      <Button color="inherit" onClick={logout}>Logout</Button>
    </Stack>
  </Toolbar>
</AppBar>


      {/* Task Management Card */}
      <Card className="shadow-xl rounded-2xl">
        <CardHeader title="Task Management" titleTypographyProps={{ align: 'center', variant: 'h5' }} />
        <CardContent>
          {/* Add Task Form */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={2}>
            <TextField
              label="Task Title"
              value={newTask.title}
              onChange={e => setNewTask({ ...newTask, title: e.target.value })}
              fullWidth
            />
            <Select
              value={newTask.employeeId}
              onChange={e => setNewTask({ ...newTask, employeeId: e.target.value })}
              displayEmpty
              fullWidth
            >
              <MenuItem value="" disabled>Select Employee</MenuItem>
              {employees.map(emp => (
                <MenuItem key={emp._id} value={emp._id}>{emp.name}</MenuItem>
              ))}
            </Select>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAddTask}
            >
              Add Task
            </Button>
          </Stack>

          {/* Tasks Table */}
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Employee</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.length > 0 ? tasks.map(task => (
                  <TableRow key={task._id}>
                    <TableCell>{task.title}</TableCell>
                    <TableCell>{task.employeeId?.name || '-'}</TableCell>
                    <TableCell>
                      <Chip
                        label={task.status}
                        color={task.status === 'Completed' ? 'success' : 'default'}
                        clickable
                        onClick={() => toggleStatus(task)}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Delete Task">
                        <IconButton color="error" onClick={() => handleDelete(task._id)}>
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No tasks found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

        </CardContent>
      </Card>
    </div>
  );
}
