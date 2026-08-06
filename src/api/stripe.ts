import { Router, Response } from "express";
import { AuthRequest, requireAuth, requireRole } from "../middleware.js";
import { Task, Proposal, Payment } from "../models.js";
import Stripe from "stripe";
import env from "../config/env.js";

const stripeRouter = Router();

// Important: Do not fail if env varies. Handled gracefully.
let stripe: Stripe | null = null;
if (env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: "2024-12-18.acacia" as any });
}

// Client: Create Checkout Session
stripeRouter.post("/create-checkout-session", requireAuth, requireRole(['Client']), async (req: AuthRequest, res: Response) => {
  try {
    const { proposalId } = req.body;
    
    const proposal = await Proposal.findById(proposalId);
    if (!proposal) return res.status(404).json({ error: "Proposal not found" });

    const task = await Task.findById(proposal.task_id);
    if (!task || task.client_email !== req.user.email) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    if (task.status !== 'Open') {
      return res.status(400).json({ error: "Task is no longer open" });
    }

    // Mock/Dummy Stripe Integration Logic
    if (!stripe) {
      const dummySessionId = "dummy_session_" + Date.now();
      const redirectUrl = `/payment/checkout?session_id=${dummySessionId}&proposal_id=${proposal._id}`;
      return res.json({ id: dummySessionId, url: redirectUrl });
    }

    // Create Stripe Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Task: ${task.title}`,
              description: `Freelancer: ${proposal.freelancer_email}`,
            },
            unit_amount: proposal.proposed_budget * 100, // in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${env.APP_URL || 'http://localhost:3000'}/payment/success?session_id={CHECKOUT_SESSION_ID}&proposal_id=${proposal._id}`,
      cancel_url: `${env.APP_URL || 'http://localhost:3000'}/dashboard/client`,
      customer_email: req.user.email,
    });

    res.json({ id: session.id, url: session.url });
  } catch (error) {
    console.error("Stripe error:", error);
    res.status(500).json({ error: "Internal server error connecting to Stripe" });
  }
});

// Verify & Confirm Session
stripeRouter.post("/confirm-session", requireAuth, requireRole(['Client']), async (req: AuthRequest, res: Response) => {
  try {
    const { session_id, proposal_id } = req.body;
    
    let isPaid = false;

    // Check dummy vs real
    if (session_id.startsWith("dummy_session_")) {
      isPaid = true;
    } else {
      if (!stripe) return res.status(500).json({ error: "Stripe not configured" });
      const session = await stripe.checkout.sessions.retrieve(session_id);
      if (session.payment_status === "paid") isPaid = true;
    }

    if (!isPaid) {
      return res.status(400).json({ error: "Payment not completed" });
    }

    const proposal = await Proposal.findById(proposal_id);
    if (!proposal) return res.status(404).json({ error: "Proposal not found" });

    const task = await Task.findById(proposal.task_id);
    if (!task) return res.status(404).json({ error: "Task not found" });

    if (proposal.status === 'Accepted') {
       return res.json({ message: "Already processed", task, proposal });
    }

    // Update state
    proposal.status = 'Accepted';
    await proposal.save();

    task.status = 'In Progress';
    await task.save();

    // Reject all other pending proposals for this task
    await Proposal.updateMany(
      { task_id: task._id, _id: { $ne: proposal._id }, status: 'Pending' },
      { $set: { status: 'Rejected' } }
    );

    // Save payment record
    await Payment.create({
      client_email: req.user.email,
      freelancer_email: proposal.freelancer_email,
      task_id: task._id,
      amount: proposal.proposed_budget,
      transaction_id: session_id,
      payment_status: "paid"
    });

    res.json({ success: true, task, proposal });
  } catch (error) {
    res.status(500).json({ error: "Failed to confirm payment" });
  }
});

export default stripeRouter;
