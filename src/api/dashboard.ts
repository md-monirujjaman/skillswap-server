import { User } from "../models.js";
import express from "express";
import type { Response } from "express-serve-static-core";
import { AuthRequest, requireAuth } from "../middleware.js";

const genericRouter = express.Router();

genericRouter.get("/client", requireAuth, async (req: AuthRequest, res: Response) => {
   // This endpoint should aggregate Data
   if (req.user.role !== 'Client') return res.status(403).json({});
   
   const { Task, Proposal } = await import("../models.js");
   const tasks = await Task.find({ client_email: req.user.email });
   
   const stats = {
     totalTasks: tasks.length,
     openTasks: tasks.filter(t => t.status === 'Open').length,
     inProgressTasks: tasks.filter(t => t.status === 'In Progress').length,
     completedTasks: tasks.filter(t => t.status === 'Completed').length,
     totalSpent: 0
   };
   
   const { Payment } = await import("../models.js");
   const payments = await Payment.find({ client_email: req.user.email });
   stats.totalSpent = payments.reduce((sum, p) => sum + p.amount, 0);

   res.json({ stats });
});

genericRouter.get("/freelancer", requireAuth, async (req: AuthRequest, res: Response) => {
   if (req.user.role !== 'Freelancer') return res.status(403).json({});

   const { Proposal, Payment } = await import("../models.js");
   const proposals = await Proposal.find({ freelancer_email: req.user.email });
   
   const stats = {
      totalProposals: proposals.length,
      pendingProposals: proposals.filter(t => t.status === 'Pending').length,
      acceptedProposals: proposals.filter(t => t.status === 'Accepted').length,
      totalEarnings: 0
   };

   const payments = await Payment.find({ freelancer_email: req.user.email, payment_status: 'paid' });
   stats.totalEarnings = payments.reduce((sum, p) => sum + p.amount, 0);
   
   res.json({ stats });
});

genericRouter.get("/freelancer/earnings", requireAuth, async (req: AuthRequest, res: Response) => {
   if (req.user.role !== 'Freelancer') return res.status(403).json({});

   const { Payment, Task } = await import("../models.js");
   const payments = await Payment.find({ freelancer_email: req.user.email, payment_status: 'paid' }).sort({ createdAt: -1 });
   
   const formattedPayments = await Promise.all(payments.map(async (p: any) => {
      const task = await Task.findById(p.task_id);
      return {
         ...p.toObject(),
         task_title: task ? task.title : 'Unknown Task',
         client_name: p.client_email.split('@')[0], // Fallback if no real name lookup is done
      };
   }));

   res.json({ earnings: formattedPayments });
});

export default genericRouter;
