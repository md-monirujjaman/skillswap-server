import env from "./src/config/env.js";
import { createApp } from "./src/app.js";
import { connectDatabase } from "./src/db.js";
import { User } from "./src/models.js";
import bcrypt from "bcryptjs";

async function seedUsers() {
  const adminExists = await User.findOne({ email: "admin@skillwrap.com" });
  if (!adminExists) {
    const hashedPass = await bcrypt.hash("admin@skillwrap.com", 10);
    await User.create({
      name: "Admin",
      email: "admin@skillwrap.com",
      password: hashedPass,
      role: "Admin",
    });
    console.log("Admin seeded.");
  }

  const freelancerExists = await User.findOne({ email: "freelancer@gmail.com" });
  if (!freelancerExists) {
    const hashedPass = await bcrypt.hash("freelancer@gmail.com", 10);
    await User.create({
      name: "Freelancer",
      email: "freelancer@gmail.com",
      password: hashedPass,
      role: "Freelancer",
      skills: ["React", "TypeScript", "Node.js"],
    });
    console.log("Freelancer seeded.");
  }
}

const app = createApp();

async function startServer() {
  const port = Number(app.locals.port || Number(env.PORT) || 3000);

  try {
    await seedUsers();

    app.listen(port, "0.0.0.0", () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

if (process.env.VERCEL !== "1") {
  await startServer();
}

export default app;
