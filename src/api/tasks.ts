import express from "express";
import type { Request, Response } from "express-serve-static-core";
import { AuthRequest, requireAuth, requireRole } from "../middleware.js";
import { Task, Proposal } from "../models.js";

const tasksRouter = express.Router();

// Browse tasks with pagination and search
tasksRouter.get("/", async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 9;
    const search = req.query.search as string || "";
    const category = req.query.category as string || "";

    const query: any = { status: 'Open' }; // Only show open tasks to browse
    
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }
    if (category) {
      query.category = category;
    }

    const total = await Task.countDocuments(query);
    const tasks = await Task.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const { User } = await import("../models.js");
    const augmentedTasks = await Promise.all(tasks.map(async (t) => {
      const taskObj = t.toObject() as any;
      const client = await User.findOne({ email: t.client_email });
      taskObj.client_name = client ? client.name : t.client_email.split('@')[0];
      return taskObj;
    }));

    res.json({
      tasks: augmentedTasks,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error("Fetch tasks error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Client: Manage own tasks
tasksRouter.get("/manage", requireAuth, requireRole(['Client']), async (req: AuthRequest, res: Response) => {
  try {
    const tasks = await Task.find({ client_email: req.user.email }).sort({ createdAt: -1 });
    // We can fetch accepted proposals to map freelancer_email
    const taskIds = tasks.map((t: any) => t._id);
    const acceptedProposals = await Proposal.find({ task_id: { $in: taskIds }, status: 'Accepted' });
    
    const augmentedTasks = tasks.map((t: any) => {
      const taskObj = t.toObject() as any;
      const accepted = acceptedProposals.find((p: any) => p.task_id.toString() === t._id.toString());
      if (accepted) {
        taskObj.freelancer_email = accepted.freelancer_email;
      }
      return taskObj;
    });

    res.json(augmentedTasks);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Freelancer: Get assigned tasks
tasksRouter.get("/assigned", requireAuth, requireRole(['Freelancer']), async (req: AuthRequest, res: Response) => {
  try {
    const { Payment } = await import("../models.js");
    const payments = await Payment.find({ freelancer_email: req.user.email, payment_status: 'paid' });
    const taskIds = payments.map(p => p.task_id);
    
    const tasks = await Task.find({ _id: { $in: taskIds } }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get single task
tasksRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      res.status(404).json({ error: "Task not found" });
      return;
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Client: Post a task
tasksRouter.post("/", requireAuth, requireRole(['Client']), async (req: AuthRequest, res: Response) => {
  try {
    const { title, category, description, budget, deadline } = req.body;
    const task = await Task.create({
      title, category, description, budget, deadline,
      client_email: req.user.email,
      status: 'Open'
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: "Failed to create task" });
  }
});

// Client: Update a task
tasksRouter.put("/:id", requireAuth, requireRole(['Client']), async (req: AuthRequest, res: Response) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task || task.client_email !== req.user.email) {
      res.status(403).json({ error: "Unauthorized or not found" });
      return;
    }
    if (task.status !== 'Open') {
      res.status(400).json({ error: "Can only edit open tasks" });
      return;
    }

    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Failed to update task" });
  }
});

// Client: Delete task
tasksRouter.delete("/:id", requireAuth, requireRole(['Client', 'Admin']), async (req: AuthRequest, res: Response) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    if (req.user.role !== 'Admin' && task.client_email !== req.user.email) {
      res.status(403).json({ error: "Unauthorized" });
      return;
    }

    // Check if proposals exist and are accepted? 
    // Assignment says: Delete a task row - only possible if no proposal has been approved yet.
    const acceptedProposals = await Proposal.countDocuments({ task_id: task._id, status: 'Accepted' });
    if (acceptedProposals > 0 && req.user.role !== 'Admin') {
      res.status(400).json({ error: "Cannot delete task with accepted proposal" });
      return;
    }

    await Task.findByIdAndDelete(req.params.id);
    await Proposal.deleteMany({ task_id: task._id }); // cleanup proposals

    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete task" });
  }
});

export default tasksRouter;
