import express from "express";
import type { Request, Response } from "express-serve-static-core";
import { AuthRequest, requireAuth, requireRole } from "../middleware.js";
import { User } from "../models.js";

const usersRouter = express.Router();

// Public: Get Freelancers
usersRouter.get("/freelancers", async (req: Request, res: Response) => {
  try {
    const freelancers = await User.find({ role: 'Freelancer', isBlocked: false })
      .select('-password');
    res.json(freelancers);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Public: Get Freelancer Profile
usersRouter.get("/freelancers/:id", async (req: Request, res: Response) => {
  try {
    const freelancer = await User.findOne({ _id: req.params.id, role: 'Freelancer' }).select('-password');
    if (!freelancer) {
      res.status(404).json({ error: "Freelancer not found" });
      return;
    }
    res.json(freelancer);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Worker: Update own profile
usersRouter.put("/profile", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { name, image, skills, bio, hourlyRate } = req.body;
    
    const updated = await User.findByIdAndUpdate(req.user._id, {
      name, image, skills, bio, hourlyRate
    }, { new: true }).select('-password');

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Failed to update profile" });
  }
});

// Any user: Toggle bookmark a task
usersRouter.post("/bookmark/:taskId", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const taskId = req.params.taskId as any;
    const isBookmarked = user.bookmarkedTasks.includes(taskId);

    if (isBookmarked) {
      user.bookmarkedTasks = user.bookmarkedTasks.filter((id: any) => id.toString() !== taskId.toString());
    } else {
      user.bookmarkedTasks.push(taskId);
    }

    await user.save();
    res.json({ bookmarked: !isBookmarked, bookmarks: user.bookmarkedTasks });
  } catch (error) {
    res.status(500).json({ error: "Failed to toggle bookmark" });
  }
});

// Any user: Get bookmarks
usersRouter.get("/bookmarks", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user._id).populate('bookmarkedTasks');
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    res.json(user.bookmarkedTasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to get bookmarks" });
  }
});

export default usersRouter;
