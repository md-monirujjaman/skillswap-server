import express from "express";
import type { Response } from "express-serve-static-core";
import { AuthRequest, requireAuth, requireRole } from "../middleware.js";
import { Task, Proposal } from "../models.js";

const proposalsRouter = express.Router();

// Freelancer: Submit proposal
proposalsRouter.post("/", requireAuth, requireRole(['Freelancer']), async (req: AuthRequest, res: Response) => {
  try {
    const { task_id, proposed_budget, estimated_days, cover_note } = req.body;
    
    // Check if task exists and is open
    const task = await Task.findById(task_id);
    if (!task || task.status !== 'Open') {
      res.status(400).json({ error: "Task not available" });
      return;
    }

    // Check if already submitted
    const existing = await Proposal.findOne({ task_id, freelancer_email: req.user.email });
    if (existing) {
      res.status(400).json({ error: "You already submitted a proposal for this task" });
      return;
    }

    const proposal = await Proposal.create({
      task_id,
      freelancer_email: req.user.email,
      proposed_budget,
      estimated_days,
      cover_note,
      status: 'Pending'
    });

    res.status(201).json(proposal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to submit proposal" });
  }
});

// Freelancer: Get my proposals
proposalsRouter.get("/mine", requireAuth, requireRole(['Freelancer']), async (req: AuthRequest, res: Response) => {
  try {
    const proposals = await Proposal.find({ freelancer_email: req.user.email }).populate('task_id');
    res.json(proposals);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch proposals" });
  }
});

// Client: Get proposals for a task
proposalsRouter.get("/task/:taskId", requireAuth, requireRole(['Client']), async (req: AuthRequest, res: Response) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task || task.client_email !== req.user.email) {
      res.status(403).json({ error: "Unauthorized" });
      return;
    }

    const proposals = await Proposal.find({ task_id: req.params.taskId }).sort({ submitted_at: -1 });
    res.json(proposals);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch proposals" });
  }
});

// Client: Reject proposal
proposalsRouter.post("/:id/reject", requireAuth, requireRole(['Client']), async (req: AuthRequest, res: Response) => {
  try {
    const proposal = await Proposal.findById(req.params.id);
    if (!proposal) {
       res.status(404).json({ error: "Not found" });
       return;
    }

    const task = await Task.findById(proposal.task_id);
    if (!task || task.client_email !== req.user.email) {
       res.status(403).json({ error: "Unauthorized" });
       return;
    }

    proposal.status = 'Rejected';
    await proposal.save();

    res.json(proposal);
  } catch (error) {
    res.status(500).json({ error: "Failed to update proposal" });
  }
});

export default proposalsRouter;
