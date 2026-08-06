import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // For credential login
  image: { type: String, default: '' },
  role: { type: String, enum: ['Client', 'Freelancer', 'Admin'], required: true },
  skills: { type: [String], default: [] },
  bio: { type: String, default: '' },
  hourlyRate: { type: Number, default: 0 },
  isBlocked: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false }, // Verified Checkmark for Freelancers
  bookmarkedTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }], // Task bookmarking
  createdAt: { type: Date, default: Date.now }
});

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  budget: { type: Number, required: true },
  deadline: { type: Date, required: true },
  client_email: { type: String, required: true },
  status: { type: String, enum: ['Open', 'In Progress', 'Completed'], default: 'Open' },
  deliverable_url: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

const proposalSchema = new mongoose.Schema({
  task_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
  freelancer_email: { type: String, required: true },
  proposed_budget: { type: Number, required: true },
  estimated_days: { type: Number, required: true },
  cover_note: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Accepted', 'Rejected'], default: 'Pending' },
  submitted_at: { type: Date, default: Date.now }
});

const paymentSchema = new mongoose.Schema({
  client_email: { type: String, required: true },
  freelancer_email: { type: String, required: true },
  task_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
  amount: { type: Number, required: true },
  transaction_id: { type: String, required: true },
  payment_status: { type: String, required: true },
  paid_at: { type: Date, default: Date.now }
});

const reviewSchema = new mongoose.Schema({
  task_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
  reviewer_email: { type: String, required: true },
  reviewee_email: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});

export const User = mongoose.model('User', userSchema);
export const Task = mongoose.model('Task', taskSchema);
export const Proposal = mongoose.model('Proposal', proposalSchema);
export const Payment = mongoose.model('Payment', paymentSchema);
export const Review = mongoose.model('Review', reviewSchema);
