import express from "express";
import type { Request, Response } from "express-serve-static-core";
import authRouter from "./auth.js";
import tasksRouter from "./api/tasks.js";
import proposalsRouter from "./api/proposals.js";
import usersRouter from "./api/users.js";
import adminRouter from "./api/admin.js";
import stripeRouter from "./api/stripe.js";
import actionsRouter from "./api/actions.js";
import dashboardRouter from "./api/dashboard.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/tasks", tasksRouter);
router.use("/proposals", proposalsRouter);
router.use("/users", usersRouter);
router.use("/admin", adminRouter);
router.use("/payment", stripeRouter);
router.use("/actions", actionsRouter);
router.use("/dashboard", dashboardRouter);

router.get("/home", async (req: Request, res: Response) => {
  try {
    const { Task, User, Payment } = await import("./models.js");
    
    // Latest 4 tasks
    const tasks = await Task.find({ status: 'Open' }).sort({ createdAt: -1 }).limit(4);
    
    // Manually map client name
    const latestTasks = await Promise.all(tasks.map(async (t) => {
      const taskObj = t.toObject() as any;
      const client = await User.findOne({ email: t.client_email });
      taskObj.client_name = client ? client.name : t.client_email.split('@')[0];
      return taskObj;
    }));

    // Top freelancers (verified or high rating)
    const freelancers = await User.find({ role: 'Freelancer' }).sort({ createdAt: -1 }).limit(4);
    const { Proposal, Review } = await import("./models.js");
    
    const topFreelancers = await Promise.all(freelancers.map(async (f) => {
      const uObj = f.toObject() as any;
      
      // Calculate finished jobs (proposals accepted & task completed, or just payment made)
      // Actually we can count accepted proposals for tasks that are completed.
      const finishedJobs = await Payment.countDocuments({ freelancer_email: f.email, payment_status: "paid" });
      uObj.finished_jobs = finishedJobs;
      
      // Calculate rating
      const reviews = await Review.find({ reviewee_email: f.email });
      if (reviews.length > 0) {
        const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
        uObj.average_rating = (sum / reviews.length).toFixed(1);
      } else {
        uObj.average_rating = "5.0"; // Default
      }
      return uObj;
    }));
    
    // Stats
    const totalTasks = await Task.countDocuments();
    const totalUsers = await User.countDocuments();
    const payments = await Payment.find({ payment_status: 'paid' });
    const totalPayout = payments.reduce((sum, p) => sum + p.amount, 0);

    res.json({
      latestTasks,
      topFreelancers,
      stats: { totalTasks, totalUsers, totalPayout }
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok" });
});

export default router;
