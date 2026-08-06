# Skillwrap Standalone Backend Server (API)

Welcome to the standalone backend API service for **Skillwrap**, a premium freelance micro-task platform. This service is built using Express, TypeScript, Mongoose, and JWT Cookie Authentication, providing full authentication states, payment handling, and database services.

---

## 🚀 Key Technical Highlights
- **Framework**: Express.js with TypeScript and Node.js ES Modules (ESM).
- **Database**: MongoDB via Mongoose Object-Modeling.
- **Authentication**: Custom cookie-based JWT session authorization alongside role-based access control.
- **Payment Processing**: Integrated Stripe backend (real + fallback mock flow).
- **Environment Driven**: Full CORS security configuration and environment bindings.

---

## 📋 Requirements
- **Node.js**: `v18.x` or higher
- **NPM**: `v9.x` or higher
- **MongoDB**: A running MongoDB instance (local or MongoDB Atlas Cloud Database)

---

## ⚙️ Installation
1. Extract or navigate into the `/server` folder:
   ```bash
   cd server
   ```
2. Install all required dependencies and TypeScript declaration packages:
   ```bash
   npm install
   ```

---

## 🔐 Environment Variables
Create a `.env` file in the `/server` root directory. Use the structure provided in `.env.example` as a template:

```env
PORT=3000
MONGODB_URI="mongodb+srv://<user>:<pass>@cluster0.mongodb.net/skillwrap"
JWT_SECRET="use_a_long_cryptographically_secure_random_string"
STRIPE_SECRET_KEY="sk_test_..."
APP_URL="http://localhost:5173" # URL of your active frontend client
```

### Explanation of Variables:
- **PORT**: Port to start the server (e.g., `3000`).
- **MONGODB_URI**: MongoDB connection URI. This binds your backend models to your Mongo database.
- **JWT_SECRET**: The private secret key used to digitally sign user auth tokens stored in cookies.
- **STRIPE_SECRET_KEY**: Your test/production Stripe developer API key.
- **APP_URL**: The exact URL of the React/Vite client so CORS dynamically whitelist the front-end requests.

---

## 🛠️ Available Scripts

### Run in Development Mode
Launches the server in real-time hot-rebuild mode using `tsx` (TypeScript Execute):
```bash
npm run dev
```

### Build for Production
Compiles the TypeScript source files directly into production-optimized JavaScript inside the `/dist` directory:
```bash
npm run build
```

### Start Production Server
Executes the compiled JavaScript server files from the `/dist` output folder:
```bash
npm start
```

---

## 📂 Folder Structure
The API is cleanly modularized for separation of concerns and effortless scaling:

```text
server/
├── api/                   # Controller folders for sub-routes
│   ├── actions.ts         # Handles task delivery & feedback reviews
│   ├── admin.ts           # Admin controls (blocking, statistics, verification)
│   ├── dashboard.ts       # Aggregations for worker & client metrics
│   ├── proposals.ts       # Proposal creation, bids, and states
│   ├── stripe.ts          # Payment sessions and validations
│   ├── tasks.ts           # Task postings, pagination, and filter queries
│   └── users.ts           # User profiles and bookmark configurations
├── api.ts                 # Aggregates and binds all routers to /api/*
├── auth.ts                # Handles login, registration, and active state (me)
├── betterAuth.ts          # Modular configuration helper for better-auth rules
├── middleware.ts          # Protection and verification middleware (JWT and roles)
├── models.ts              # Mongoose Schema definitions for collections
├── server.ts              # Entry-point file; mounts database, middlewares, and CORS
├── tsconfig.json          # TypeScript compilation settings
├── package.json           # Dependencies, scripts, and package metadata
├── .env.example           # Reference file for environment variables
└── README.md              # Documentation
```

---

## ☁️ Deployment

### Deployed as a Standalone Node App (e.g., on Render, Railway, Heroku)
1. Push this standalone `server/` directory to a dedicated GitHub repository.
2. Link your repository to your hosting provider (e.g., Render Web Service).
3. Set the following Build and Start settings:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
4. Add all environment variables in the provider's Secrets/Environment console.

---

## ⚠️ Common Errors & Troubleshooting

### 1. MongoDB Connection Failure
- **Error**: `MongooseError: The connection string is invalid...` or hangs indefinitely.
- **Solution**: Ensure your IP is whitelisted under "Network Access" in MongoDB Atlas (`0.0.0.0/0` for global access), and verify that database username & password strings are fully escaped/valid.

### 2. CORS Blocked
- **Error**: `Access to fetch at '...' from origin '...' has been blocked by CORS policy.`
- **Solution**: Check that the `APP_URL` variable in your server's `.env` is set exactly to the client's URL (with correct protocol `http://` or `https://` and without any trailing slash `/`).

### 3. Missing JWT Secret Warn
- **Error**: `Warning: JWT_SECRET environment variable is missing.`
- **Solution**: Make sure you have created `.env` file correctly at the root of the server directory, not accidentally in parent directories.
