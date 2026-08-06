import express from "express";
import type { Response } from "express-serve-static-core";
import { AuthRequest, requireAuth, requireRole } from "../middleware.js";
import { Task, Review, Payment } from "../models.js";

const actionsRouter = express.Router();

// Freelancer: Submit Deliverable & Complete Task
actionsRouter.post("/tasks/:id/deliver", requireAuth, requireRole(['Freelancer']), async (req: AuthRequest, res: Response) => {
  try {
    const { deliverable_url } = req.body;
    const task = await Task.findById(req.params.id);
    
    if (!task) return res.status(404).json({ error: "Task not found" });

    // Validate that this freelancer was awarded the task by checking payments
    const payment = await Payment.findOne({ task_id: task._id, freelancer_email: req.user.email });
    if (!payment) return res.status(403).json({ error: "Unauthorized. You are not hired for this." });

    if (task.status !== 'In Progress') {
      return res.status(400).json({ error: "Task is not In Progress" });
    }

    task.status = 'Completed';
    task.deliverable_url = deliverable_url;
    await task.save();

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: "Failed to submit deliverable" });
  }
});

// Leave a Review
actionsRouter.post("/tasks/:id/review", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { reviewee_email, rating, comment } = req.body;
    const task = await Task.findById(req.params.id);
    
    if (!task) {
       return res.status(404).json({ error: "Task not found" });
    }
    
    // Check authorization: Must be the client OR the hired freelancer
    if (req.user.role === 'Client' && task.client_email !== req.user.email) {
       return res.status(403).json({ error: "Unauthorized" });
    }
    
    if (req.user.role === 'Freelancer') {
       const payment = await Payment.findOne({ task_id: task._id, freelancer_email: req.user.email });
       if (!payment) return res.status(403).json({ error: "Unauthorized. You are not hired for this." });
    }

    if (task.status !== 'Completed') {
       return res.status(400).json({ error: "Task is not completed yet." });
    }

    // Checking if already reviewed by this user
    const existing = await Review.findOne({ task_id: task._id, reviewer_email: req.user.email });
    if (existing) {
       return res.status(400).json({ error: "You already reviewed this task." });
    }

    const review = await Review.create({
      task_id: task._id,
      reviewer_email: req.user.email,
      reviewee_email,
      rating,
      comment
    });

    res.json(review);
  } catch (error) {
     res.status(500).json({ error: "Failed to leave review" });
  }
});

export default actionsRouter;
