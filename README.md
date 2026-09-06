# Skillwrap — Standalone Backend API

> **Production-ready backend API for Skillwrap**, a premium freelance micro-task marketplace built with **Node.js, Express, TypeScript, MongoDB/Mongoose, JWT Cookie Authentication, and Stripe**.

Skillwrap provides a modular backend architecture for managing users, authentication, freelance tasks, proposals, worker/client dashboards, payments, reviews, administration, and account-level configurations.

The backend is designed to run independently from the frontend and can be deployed to platforms such as **Render, Railway, Heroku, VPS, or other Node.js-compatible hosting providers**.

---

## 📌 Table of Contents

* [Overview](#-overview)
* [Technology Stack](#-technology-stack)
* [Core Features](#-core-features)
* [Architecture](#-architecture)
* [Project Structure](#-project-structure)
* [Requirements](#-requirements)
* [Local Installation](#-local-installation)
* [Environment Configuration](#-environment-configuration)
* [Development](#-development)
* [Production Build](#-production-build)
* [API Architecture](#-api-architecture)
* [Authentication & Authorization](#-authentication--authorization)
* [User Roles](#-user-roles)
* [Payment System](#-payment-system)
* [Database](#-database)
* [CORS Configuration](#-cors-configuration)
* [Error Handling](#-error-handling)
* [Security](#-security)
* [Deployment](#-deployment)
* [Render Deployment](#-render-deployment)
* [Railway Deployment](#-railway-deployment)
* [Production Checklist](#-production-checklist)
* [Troubleshooting](#-troubleshooting)
* [Recommended Git Configuration](#-recommended-git-configuration)
* [License](#-license)

---

# 🚀 Overview

Skillwrap Backend is a standalone REST API service responsible for powering the Skillwrap freelance micro-task platform.

The API handles:

* User registration and login
* JWT-based authentication
* HTTP-only cookie sessions
* Role-based authorization
* User profile management
* Freelance task creation
* Task discovery and filtering
* Proposal and bidding workflows
* Task delivery and feedback
* Reviews and ratings
* Worker/client dashboards
* Bookmark management
* Administrative controls
* User verification
* User blocking
* Platform statistics
* Stripe payment sessions
* Payment validation
* MongoDB persistence

The backend is completely separated from the frontend, allowing the frontend application to communicate with it through REST API endpoints.

---

# 🧰 Technology Stack

| Technology        | Purpose                                        |
| ----------------- | ---------------------------------------------- |
| Node.js           | JavaScript runtime                             |
| Express.js        | HTTP server and REST API framework             |
| TypeScript        | Type-safe backend development                  |
| MongoDB           | Primary database                               |
| Mongoose          | MongoDB object modeling                        |
| JWT               | Authentication token generation and validation |
| HTTP-only Cookies | Secure session storage                         |
| Stripe            | Payment processing                             |
| TSX               | Development-time TypeScript execution          |
| dotenv            | Environment configuration                      |
| ES Modules        | Modern JavaScript module system                |

---

# ✨ Core Features

## 🔐 Authentication

* User registration
* User login
* Current-user/session endpoint
* JWT authentication
* HTTP-only authentication cookies
* Logout/session clearing
* Protected routes
* Role-based authorization

## 👤 User Management

* User profiles
* Worker/client account states
* Profile configuration
* Bookmarks
* Account verification
* Account blocking
* Administrative user management

## 📋 Task Management

* Create tasks
* View tasks
* Task details
* Pagination
* Filtering
* Task status management
* Task delivery workflow

## 💼 Proposal Management

* Submit proposals
* Bid management
* Proposal status tracking
* Client-side proposal handling
* Worker proposal workflow

## ⭐ Reviews & Feedback

* Task feedback
* Worker/client reviews
* Ratings
* Review state management

## 📊 Dashboards

Dedicated dashboard data for:

* Workers
* Clients
* Task performance
* Proposal statistics
* Earnings/activity metrics
* Platform-level statistics

## 💳 Stripe Payments

* Stripe Checkout/session creation
* Payment validation
* Test-mode support
* Production Stripe support
* Fallback/mock payment flow where configured

## 🛡️ Administration

* User blocking
* User verification
* Platform statistics
* Administrative controls
* Role-protected admin endpoints

---

# 🏗️ Architecture

The backend follows a modular Express architecture.

```text
Client / Frontend
       │
       ▼
   HTTP Request
       │
       ▼
┌─────────────────────┐
│    Express Server   │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ Middleware Layer    │
│                     │
│ • CORS              │
│ • Authentication    │
│ • Authorization     │
│ • Request parsing   │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│      API Layer      │
│                     │
│ • Users             │
│ • Tasks             │
│ • Proposals         │
│ • Actions           │
│ • Dashboard         │
│ • Admin             │
│ • Stripe            │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│    Mongoose Models  │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│      MongoDB        │
└─────────────────────┘
```

---

# 📂 Project Structure

```text
server/
│
├── api/
│   ├── actions.ts
│   ├── admin.ts
│   ├── dashboard.ts
│   ├── proposals.ts
│   ├── stripe.ts
│   ├── tasks.ts
│   └── users.ts
│
├── api.ts
├── auth.ts
├── betterAuth.ts
├── middleware.ts
├── models.ts
├── server.ts
│
├── .env
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── tsconfig.json
├── README.md
│
└── dist/
```

### File Responsibilities

### `server.ts`

Main application entry point.

Responsible for:

* Loading environment variables
* Initializing Express
* Configuring middleware
* Configuring CORS
* Connecting to MongoDB
* Mounting API routes
* Starting the HTTP server

### `api.ts`

Central API router.

Responsible for mounting individual API modules under `/api`.

### `auth.ts`

Authentication module responsible for:

* Registration
* Login
* Logout
* Current authenticated user
* JWT cookie handling

### `middleware.ts`

Security and authorization middleware.

Responsible for:

* JWT validation
* Authentication checks
* Role validation
* Protected route access

### `models.ts`

Contains Mongoose schemas/models used by the application.

### `api/tasks.ts`

Handles task-related operations.

### `api/proposals.ts`

Handles proposal and bidding workflows.

### `api/actions.ts`

Handles task delivery, completion actions, feedback, and related operations.

### `api/dashboard.ts`

Provides aggregated dashboard information.

### `api/users.ts`

Handles profile and user-related configuration.

### `api/admin.ts`

Administrative functionality.

### `api/stripe.ts`

Stripe payment integration.

---

# 📋 Requirements

Before starting the backend, install the following:

* **Node.js 18.x or newer**
* **NPM 9.x or newer**
* **MongoDB**

  * Local MongoDB installation, or
  * MongoDB Atlas account
* Stripe account for payment functionality

Check installed versions:

```bash
node --version
npm --version
```

Recommended:

```text
Node.js >= 18
NPM >= 9
```

---

# ⚙️ Local Installation

## 1. Navigate to the server directory

```bash
cd server
```

## 2. Install dependencies

```bash
npm install
```

## 3. Create environment file

Copy the example environment file:

```bash
cp .env.example .env
```

On Windows, you can manually create:

```text
server/.env
```

## 4. Configure environment variables

Open `.env` and add the required values.

Example:

```env
PORT=3000

MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.mongodb.net/skillwrap"

JWT_SECRET="replace-with-a-long-random-secure-secret"

STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"

APP_URL="http://localhost:5173"
```

## 5. Start development server

```bash
npm run dev
```

The backend should now be available at:

```text
http://localhost:3000
```

---

# 🔐 Environment Configuration

Create:

```text
server/.env
```

Use the following structure:

```env
PORT=3000
MONGODB_URI="mongodb+srv://<user>:<password>@cluster0.mongodb.net/skillwrap"
JWT_SECRET="your-long-random-production-secret"
STRIPE_SECRET_KEY="sk_test_..."
APP_URL="http://localhost:5173"
```

---

## Environment Variables Reference

| Variable            | Required | Description                                     |
| ------------------- | -------- | ----------------------------------------------- |
| `PORT`              | Yes      | Port used by Express                            |
| `MONGODB_URI`       | Yes      | MongoDB connection string                       |
| `JWT_SECRET`        | Yes      | Secret used to sign/verify JWT tokens           |
| `STRIPE_SECRET_KEY` | Yes*     | Stripe server-side secret key                   |
| `APP_URL`           | Yes      | Frontend origin used for CORS/payment redirects |

`*` Required when Stripe functionality is enabled.

---

# 🔑 JWT Secret

Never use a weak secret such as:

```env
JWT_SECRET="123456"
```

or:

```env
JWT_SECRET="secret"
```

Use a long, random value.

Example format:

```env
JWT_SECRET="a-long-random-cryptographically-secure-secret-value"
```

For production, generate the secret using a secure password/secret generator.

**Never commit the real JWT secret to GitHub.**

---

# 🗄️ MongoDB Configuration

You can use either MongoDB Atlas or a local MongoDB server.

## MongoDB Atlas

Example:

```env
MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/skillwrap"
```

Make sure:

1. The database user exists.
2. The password is correct.
3. The database user has the required permissions.
4. Network access is configured.
5. Special characters in the username/password are URL encoded.

For example, if your password contains:

```text
@ # / : ?
```

it may need URL encoding inside the MongoDB connection string.

---

# 🌐 API Architecture

All API modules are mounted under:

```text
/api
```

The application follows a modular route structure.

Typical route groups include:

```text
/api/auth/*
/api/users/*
/api/tasks/*
/api/proposals/*
/api/actions/*
/api/dashboard/*
/api/admin/*
/api/stripe/*
```

The exact endpoint names should be treated as defined by the implementation in the corresponding route files.

---

# 🔒 Authentication & Authorization

Skillwrap uses JWT-based authentication stored through HTTP-only cookies.

Authentication flow:

```text
User
  │
  ▼
Login / Register
  │
  ▼
Backend validates credentials
  │
  ▼
JWT generated
  │
  ▼
JWT stored in HTTP-only cookie
  │
  ▼
Authenticated API requests
  │
  ▼
Middleware validates JWT
  │
  ▼
Protected endpoint
```

## Why HTTP-only cookies?

HTTP-only cookies help prevent client-side JavaScript from directly accessing the authentication token.

This reduces exposure to certain token-theft scenarios such as straightforward JavaScript-based token extraction.

---

# 👥 User Roles

The application supports role-based access control.

Typical roles include:

```text
worker
client
admin
```

Role-protected routes should verify both:

1. The user is authenticated.
2. The authenticated user has the required role.

Example conceptual middleware:

```text
authenticateUser()
        │
        ▼
authorizeRole("admin")
        │
        ▼
Admin Controller
```

---

# 💳 Payment System

Skillwrap integrates Stripe for payment processing.

The Stripe backend module is responsible for server-side payment operations.

Environment configuration:

```env
STRIPE_SECRET_KEY="sk_test_..."
```

### Stripe Modes

During development:

```text
Stripe Test Mode
```

During production:

```text
Stripe Live Mode
```

Never expose:

```text
STRIPE_SECRET_KEY
```

to the frontend.

Only the backend should access the Stripe secret key.

---

# 🧪 Development Scripts

## Development

```bash
npm run dev
```

Runs the server using `tsx` for development-time TypeScript execution.

## Production Build

```bash
npm run build
```

Compiles the TypeScript source into:

```text
dist/
```

## Production Start

```bash
npm start
```

Runs the compiled production server.

---

# 🏭 Production Workflow

Before deploying:

```bash
npm install
npm run build
npm start
```

Recommended production flow:

```text
GitHub
   │
   ▼
Hosting Provider
   │
   ├── Install dependencies
   ├── Build TypeScript
   ├── Load environment variables
   └── Start Node.js server
```

---

# 🌍 CORS Configuration

The backend uses the `APP_URL` environment variable to determine the allowed frontend origin.

Example:

```env
APP_URL="http://localhost:5173"
```

Production example:

```env
APP_URL="https://your-frontend-domain.com"
```

The frontend URL must match exactly.

### Correct

```text
https://example.com
```

### Incorrect

```text
http://example.com
```

or:

```text
https://example.com/
```

if the backend expects the value without a trailing slash.

---

# 🍪 Cookie Configuration

Because authentication uses cookies, production environments should use secure cookie configuration.

Typical production requirements include:

```text
HttpOnly
Secure
SameSite
```

When frontend and backend are hosted on different domains, cookie and CORS configuration must be compatible with the deployment architecture.

Always test authentication after deploying because incorrect cookie settings can appear as:

```text
User successfully logs in
        ↓
Cookie is not stored/sent
        ↓
Authenticated requests return 401
```

---

# 🛡️ Security

The backend should follow these security practices.

## Environment Secrets

Never commit:

```text
.env
```

to Git.

## Stripe Secrets

Never expose:

```text
STRIPE_SECRET_KEY
```

to the frontend.

## JWT Secret

Never expose:

```text
JWT_SECRET
```

to the client.

## Database Credentials

Never publish MongoDB credentials inside source code.

## Production HTTPS

Production deployments should use HTTPS.

Secure cookies should be enabled when operating over HTTPS.

---

# 🚨 Error Handling

The API should return consistent HTTP status codes.

Recommended conventions:

| Status | Meaning                        |
| ------ | ------------------------------ |
| `200`  | Successful request             |
| `201`  | Resource successfully created  |
| `400`  | Invalid request                |
| `401`  | Authentication required/failed |
| `403`  | Insufficient permissions       |
| `404`  | Resource not found             |
| `409`  | Conflict                       |
| `422`  | Validation failure             |
| `500`  | Internal server error          |

Example error response:

```json
{
  "message": "Authentication required"
}
```

Production error responses should avoid exposing internal stack traces, database credentials, or implementation details.

---

# ❤️ Health Check

For production deployment, it is recommended to expose a lightweight health endpoint such as:

```text
GET /health
```

Expected response:

```json
{
  "status": "ok"
}
```

A health endpoint makes it easier for hosting providers and monitoring systems to determine whether the server is running.

---

# 📦 Production Deployment

Skillwrap can be deployed as a standalone Node.js application.

Recommended deployment platforms include:

* Render
* Railway
* Heroku
* VPS
* Docker-compatible hosting
* Other Node.js hosting platforms

---

# ☁️ Render Deployment

## Step 1 — Push Backend to GitHub

Create a dedicated repository for the backend.

Example:

```text
skillwrap-server
```

Push the `server` project.

---

## Step 2 — Create Render Web Service

Create a new Web Service and connect the GitHub repository.

If the repository contains only the backend, use:

```text
Root Directory:
.
```

If the backend exists inside a monorepo:

```text
Root Directory:
server
```

---

## Step 3 — Configure Build Command

Use:

```bash
npm install && npm run build
```

---

## Step 4 — Configure Start Command

Use:

```bash
npm start
```

---

## Step 5 — Configure Environment Variables

Add:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_production_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret
APP_URL=https://your-frontend-domain.com
```

### Important

Most modern hosting platforms provide a dynamic `PORT`.

Your Express application should listen on:

```text
process.env.PORT
```

with a fallback for local development:

```text
3000
```

---

# 🚂 Railway Deployment

For Railway:

1. Create a new project.
2. Connect your GitHub repository.
3. Select the backend repository.
4. Configure environment variables.
5. Configure build/start commands if required.

Build:

```bash
npm run build
```

Start:

```bash
npm start
```

Required environment variables:

```env
MONGODB_URI=
JWT_SECRET=
STRIPE_SECRET_KEY=
APP_URL=
```

Use the platform-provided port when running in production.

---

# 🧪 Production Testing Checklist

After deployment, test:

### Server

* [ ] Server starts successfully
* [ ] Build completes successfully
* [ ] Health endpoint responds
* [ ] No startup errors

### Database

* [ ] MongoDB connects successfully
* [ ] Database credentials work
* [ ] Database network access is configured

### Authentication

* [ ] Registration works
* [ ] Login works
* [ ] Cookie is created
* [ ] Authenticated requests work
* [ ] Logout works
* [ ] Unauthorized requests are rejected
* [ ] Role restrictions work

### Tasks

* [ ] Task creation works
* [ ] Task listing works
* [ ] Task filtering works
* [ ] Pagination works
* [ ] Task delivery works

### Proposals

* [ ] Proposal creation works
* [ ] Proposal retrieval works
* [ ] Proposal state changes work

### Payments

* [ ] Stripe test payment works
* [ ] Payment validation works
* [ ] Production Stripe credentials are configured before going live

### CORS

* [ ] Frontend URL is correct
* [ ] Credentials are allowed where required
* [ ] Cookies are sent correctly
* [ ] No browser CORS errors

---

# 🔧 Common Errors & Troubleshooting

## 1. MongoDB Connection Failure

### Error

```text
MongooseError: The connection string is invalid
```

### Possible causes

* Invalid MongoDB URI
* Incorrect username/password
* Database user doesn't exist
* IP address not allowed
* Incorrectly encoded password
* MongoDB Atlas cluster unavailable

### Solution

Check:

```env
MONGODB_URI="..."
```

Then verify MongoDB Atlas:

```text
Database Access
Network Access
```

For temporary testing, Atlas can be configured to allow:

```text
0.0.0.0/0
```

However, unrestricted network access should be evaluated carefully for production security. Prefer a restricted allowlist where your deployment platform provides stable outbound IPs.

---

# 2. CORS Error

### Error

```text
Access to fetch at '...' from origin '...'
has been blocked by CORS policy
```

### Solution

Check:

```env
APP_URL="https://your-frontend-domain.com"
```

Make sure the frontend origin exactly matches the configured backend origin.

Check:

* Protocol
* Domain
* Port
* Trailing slash
* Credential configuration

---

# 3. JWT Secret Warning

### Error

```text
Warning: JWT_SECRET environment variable is missing.
```

### Solution

Create:

```text
server/.env
```

and add:

```env
JWT_SECRET="your-secure-random-secret"
```

Restart the server after changing environment variables.

---

# 4. Authentication Works Locally but Not in Production

Check:

```text
APP_URL
CORS
credentials: include
cookie Secure flag
cookie SameSite configuration
HTTPS
```

Cross-origin cookie authentication is especially sensitive to deployment configuration.

---

# 5. Stripe Payment Error

Check:

```env
STRIPE_SECRET_KEY="sk_test_..."
```

Make sure:

* The key belongs to the correct Stripe account.
* Test keys are used in development.
* Live keys are used only in production.
* The Stripe secret key is never placed in frontend environment variables.

---

# 📁 Recommended `.gitignore`

Your backend should include a `.gitignore` similar to:

```gitignore
node_modules/
dist/
.env
.env.local
.env.production
*.log
.DS_Store
```

Never commit real environment secrets.

---

# 📝 Recommended `.env.example`

The repository should contain an example configuration file:

```env
PORT=3000

MONGODB_URI="mongodb+srv://<user>:<password>@cluster0.mongodb.net/skillwrap"

JWT_SECRET="replace-with-a-secure-random-secret"

STRIPE_SECRET_KEY="sk_test_..."

APP_URL="http://localhost:5173"
```

`.env.example` is safe to commit because it contains placeholders rather than real credentials.

---

# 🔄 Recommended Development Workflow

```text
1. Clone repository
        ↓
2. cd server
        ↓
3. npm install
        ↓
4. Configure .env
        ↓
5. Start MongoDB / configure Atlas
        ↓
6. npm run dev
        ↓
7. Test API
        ↓
8. npm run build
        ↓
9. Deploy
        ↓
10. Configure production secrets
        ↓
11. Test authentication/payment/CORS
```

---

# 🧱 Recommended Production Architecture

For a scalable deployment:

```text
                   ┌───────────────────┐
                   │   Skillwrap Web   │
                   │     Frontend      │
                   └─────────┬─────────┘
                             │
                             │ HTTPS
                             ▼
                   ┌───────────────────┐
                   │ Skillwrap Backend │
                   │ Node + Express    │
                   └───────┬─────┬─────┘
                           │     │
                  ┌────────┘     └─────────┐
                  ▼                        ▼
          ┌──────────────┐        ┌────────────────┐
          │   MongoDB    │        │     Stripe     │
          │    Atlas     │        │    Payments    │
          └──────────────┘        └────────────────┘
```

---

# 📈 Scalability Considerations

As Skillwrap grows, the backend can be extended with:

* Centralized request validation
* Structured logging
* Rate limiting
* API versioning
* Redis caching
* Background job processing
* Email notification service
* Stripe webhook processing
* File/object storage
* Search indexing
* Automated database backups
* Monitoring and alerting
* Automated CI/CD
* Containerization with Docker

A future API versioning structure could be:

```text
/api/v1/users
/api/v1/tasks
/api/v1/proposals
/api/v1/dashboard
```

---

# 🔔 Stripe Webhooks

For production payment processing, payment state should ideally be confirmed through Stripe webhooks rather than relying exclusively on client-side success redirects.

Recommended architecture:

```text
Customer
   │
   ▼
Stripe Checkout
   │
   ▼
Stripe
   │
   ▼
Webhook
   │
   ▼
Skillwrap Backend
   │
   ▼
MongoDB
```

The webhook endpoint should validate Stripe's webhook signature before processing events.

This prevents untrusted clients from directly claiming that a payment was successful.

---

# 🧪 Testing Strategy

Before production release, test the API at multiple levels.

## Unit Tests

Test:

* Authentication logic
* Validation
* Utility functions
* Business rules

## Integration Tests

Test:

* API routes
* MongoDB operations
* Authentication middleware
* Stripe integration

## End-to-End Tests

Test complete flows such as:

```text
Register
   ↓
Login
   ↓
Create Task
   ↓
Submit Proposal
   ↓
Accept Proposal
   ↓
Complete Work
   ↓
Payment
   ↓
Review
```

---

# 🔍 Logging & Monitoring

Production deployments should have structured server logs.

Monitor:

* Server startup
* Database connection
* Authentication failures
* API errors
* Payment failures
* Stripe webhook failures
* Unexpected exceptions
* Response latency

Avoid logging sensitive information such as:

```text
Passwords
JWT secrets
Stripe secret keys
Database passwords
Authentication tokens
```

---

# 🚀 Production Checklist

Before going live, verify all of the following:

```text
[ ] Node.js production version configured
[ ] npm install works
[ ] npm run build succeeds
[ ] npm start works
[ ] MongoDB production database configured
[ ] MongoDB credentials secured
[ ] MongoDB network access configured
[ ] JWT_SECRET is strong and private
[ ] STRIPE_SECRET_KEY is private
[ ] APP_URL points to production frontend
[ ] CORS configured correctly
[ ] HTTPS enabled
[ ] Cookies configured securely
[ ] Authentication tested
[ ] Role authorization tested
[ ] Task workflows tested
[ ] Proposal workflows tested
[ ] Payment flow tested
[ ] Stripe webhook strategy configured
[ ] Error handling verified
[ ] Logs reviewed
[ ] .env excluded from Git
[ ] Health endpoint configured
[ ] Production backup strategy configured
```

---

# 🛠️ Useful Commands

Install dependencies:

```bash
npm install
```

Run development:

```bash
npm run dev
```

Build:

```bash
npm run build
```

Start production:

```bash
npm start
```

Check Node version:

```bash
node -v
```

Check NPM version:

```bash
npm -v
```

---

# 📜 License

This project is proprietary software unless a separate license is provided by the project owner.

Unauthorized redistribution, resale, or commercial reuse may be restricted.

---

# 👨‍💻 Maintainer

**Skillwrap Backend Team**

For project-specific configuration, deployment, API documentation, or infrastructure questions, refer to the project source code and deployment configuration.

---

# ✅ Final Notes

Skillwrap Backend is designed as a standalone, modular Node.js API that can be independently developed, tested, deployed, and scaled.

The recommended production architecture separates:

```text
Frontend
   │
   ▼
REST API
   │
   ├── Authentication
   ├── Users
   ├── Tasks
   ├── Proposals
   ├── Dashboard
   ├── Administration
   └── Payments
          │
          ▼
      MongoDB + Stripe
```

For production deployments, always keep secrets outside source control, use HTTPS, configure secure cookies, validate authentication on the server, and verify payment events server-side.
