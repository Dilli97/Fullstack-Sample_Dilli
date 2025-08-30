import React, { useEffect, useMemo, useState } from 'react';
import {
  AppBar, Toolbar, Box, Button, Stack, Typography,
  Card, CardContent, CardHeader, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow,
  Paper, TextField, IconButton, Tooltip, TablePagination,
  Drawer, Divider, Dialog, DialogTitle, DialogActions,
} from '@mui/material';
import { Add, Delete, Edit, Visibility } from '@mui/icons-material';
import api from '../api';
import { useAuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Employees() {
  const { logout } = useAuthContext();
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [selected, setSelected] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const filtered = useMemo(() =>
    rows.filter(r =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase()) ||
      r.role.toLowerCase().includes(search.toLowerCase())
    ), [rows, search]
  );

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/employees');
      setRows(data);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchEmployees() }, []);

  const handleDelete = async (id) => {
    await api.delete(`/employees/${id}`);
    setRows(rows.filter(r => r._id !== id));
  };

  const handleSave = async (payload) => {
    if (editing) {
      const { data } = await api.put(`/employees/${editing._id}`, payload);
      setRows(rows.map(r => (r._id === editing._id ? data : r)));
      setEditing(null);
    } else {
      const { data } = await api.post('/employees', payload);
      setRows([data, ...rows]);
    }
    setOpenForm(false);
  };

  const openView = async (row) => {
    const { data } = await api.get(`/employees/${row._id}`);
    setSelected(data);
    setDrawerOpen(true);
  };

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 via-indigo-200 to-purple-200 p-4">
      {/* Top AppBar */}
      <AppBar position="static" className="mb-4">
        <Toolbar className="flex justify-between">
          <Typography variant="h6">EMS Dashboard</Typography>
          <Stack direction="row" spacing={2}>
            <Button color="inherit" onClick={() => navigate("/employees")}>Employees</Button>
            <Button color="inherit" onClick={() => navigate("/manage")}>Manage</Button>
            <Button color="inherit" onClick={logout}>Logout</Button>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Heading */}
      <Typography variant="h4" className="text-center font-bold text-indigo-900 mb-6">
        Employee Management System
      </Typography>

      {/* Employee Card/Table */}
      <Card className="shadow-xl rounded-2xl">
        <CardHeader
          title={
            <TextField
              size="small"
              placeholder="Search by name, email, or role"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              fullWidth
            />
          }
          action={
            <Button variant="contained" startIcon={<Add />} onClick={() => { setEditing(null); setOpenForm(true) }}>
              Add Employee
            </Button>
          }
        />
        <CardContent>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => (
                  <TableRow key={row._id} hover>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>{row.role}</TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Tooltip title="View">
                          <IconButton onClick={() => openView(row)}><Visibility /></IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton onClick={() => { setEditing(row); setOpenForm(true) }}><Edit /></IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton color="error" onClick={() => handleDelete(row._id)}><Delete /></IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <Typography align="center" sx={{ py: 4 }}>
                        {loading ? 'Loading…' : 'No employees found'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={filtered.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </CardContent>
      </Card>

      {/* Employee Form Dialog */}
      <EmployeeForm open={openForm} onClose={() => setOpenForm(false)} onSave={handleSave} editing={editing} />

      {/* Employee Drawer */}
      <EmployeeDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} employee={selected} />
    </div>
  )
}

// Employee Form Component
function EmployeeForm({ open, onClose, onSave, editing }) {
  const [form, setForm] = useState(editing || { name: '', email: '', role: '' });
  useEffect(() => setForm(editing || { name: '', email: '', role: '' }), [editing]);

  const handleSubmit = async (e) => { e.preventDefault(); await onSave(form) };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{editing ? 'Edit Employee' : 'Add Employee'}</DialogTitle>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2, p: 2 }}>
        <TextField label="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <TextField label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <TextField label="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} required />
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="contained" type="submit">Save</Button>
        </Stack>
      </Box>
    </Dialog>
  );
}

// Employee Drawer Component
function EmployeeDrawer({ open, onClose, employee }) {
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('Pending');

  const addTask = async (e) => {
    e.preventDefault();
    if (!employee) return;
    await api.post(`/employees/${employee._id}/tasks`, { title, status });
    setTitle(''); setStatus('Pending');
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose} sx={{ '& .MuiDrawer-paper': { width: { xs: '100%', sm: 420 } } }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6">Employee Details</Typography>
        <Divider sx={{ my: 2 }} />
        {employee ? (
          <Stack spacing={1}>
            <Typography variant="subtitle2">Name</Typography>
            <Typography>{employee.name}</Typography>
            <Typography variant="subtitle2">Email</Typography>
            <Typography>{employee.email}</Typography>
            <Typography variant="subtitle2">Role</Typography>
            <Typography>{employee.role}</Typography>
          </Stack>
        ) : <Typography>Loading…</Typography>}
      </Box>
    </Drawer>
  );
}
