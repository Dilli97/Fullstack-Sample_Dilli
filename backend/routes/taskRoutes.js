import express from 'express';
import Task from '../models/Tasks.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(authMiddleware);

// Get all tasks (populate employee)
router.get('/', async (req, res) => {
  const tasks = await Task.find().populate('employeeId', 'name email role');
  res.json(tasks);
});

// Get tasks for a specific employee
router.get('/employee/:id', async (req, res) => {
  const tasks = await Task.find({ employeeId: req.params.id })
                          .populate('employeeId', 'name email role');
  res.json(tasks);
});

// Add task for a specific employee
router.post('/employee/:id', async (req, res) => {
  const task = new Task({ employeeId: req.params.id, ...req.body });
  await task.save();
  // populate before sending back
  const populatedTask = await task.populate('employeeId', 'name email role');
  res.json(populatedTask);
});

// Update task
router.put('/:id', async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true })
                         .populate('employeeId', 'name email role');
  res.json(task);
});

// Delete task
router.delete('/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: 'Task deleted' });
});

export default router;
