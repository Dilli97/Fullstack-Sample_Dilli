import mongoose from 'mongoose';

const tasksSchema = new mongoose.Schema({
  title: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' },
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
}, { timestamps: true });

export default mongoose.model('Task', tasksSchema);
