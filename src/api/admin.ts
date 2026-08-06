import express, { Response } from "express";
import { AuthRequest, requireAuth, requireRole } from "../middleware.js";
import { User, Task, Payment, Proposal } from "../models.js";

const adminRouter = express.Router();

adminRouter.use(requireAuth, requireRole(['Admin']));

// Get Dashboard Stats
adminRouter.get("/stats", async (req: AuthRequest, res: Response) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalTasks = await Task.countDocuments();
    const activeTasks = await Task.countDocuments({ status: 'In Progress' });
    
    const payments = await Payment.find({ payment_status: 'paid' });
    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

    res.json({ totalUsers, totalTasks, activeTasks, totalRevenue });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// Manage Users
adminRouter.get("/users", async (req: AuthRequest, res: Response) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

adminRouter.patch("/users/:id/block", async (req: AuthRequest, res: Response) => {
  try {
    const { isBlocked } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { isBlocked }, { new: true });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to toggle block status" });
  }
});

adminRouter.patch("/users/:id/verify", async (req: AuthRequest, res: Response) => {
  try {
    const { isVerified } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { isVerified }, { new: true });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to toggle verified status" });
  }
});

// Manage Tasks
adminRouter.get("/tasks", async (req: AuthRequest, res: Response) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// Transactions History
adminRouter.get("/transactions", async (req: AuthRequest, res: Response) => {
  try {
    const tx = await Payment.find().sort({ paid_at: -1 });
    res.json(tx);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

export default adminRouter;
