# Workshop Management REST API Backend

Production-ready, highly secure REST API backend built with **Node.js**, **Express**, **TypeScript**, **Prisma ORM**, and **Supabase (PostgreSQL)**.

---

## 🛠 Tech Stack

- **Runtime & Language**: Node.js & TypeScript
- **Framework**: Express.js
- **Database & ORM**: PostgreSQL (Supabase) with Prisma ORM
- **Security & Headers**: Helmet, CORS, bcryptjs
- **Authentication**: Stateless JWT (JSON Web Tokens) with Bearer token authentication
- **Data Validation**: Zod schema validation
- **Dev Tools**: ts-node-dev, tsx, typescript

---

## 📁 Project Architecture

```
backend/
├── prisma/
│   └── schema.prisma             # Supabase PostgreSQL schema (Admin & Registration)
├── src/
│   ├── config/
│   │   └── prisma.ts             # Singleton PrismaClient instance
│   ├── controllers/
│   │   ├── auth.controller.ts    # Admin registration & login
│   │   └── registration.controller.ts # Workshop registrations CRUD handlers
│   ├── middlewares/
│   │   ├── auth.middleware.ts    # JWT verification & Bearer token extraction
│   │   └── error.middleware.ts   # Global error handler (Zod, Prisma P2002/P2025, JWT)
│   ├── routes/
│   │   ├── auth.routes.ts        # /auth endpoints
│   │   └── registration.routes.ts # /workshops/register endpoints
│   ├── types/
│   │   └── express.d.ts          # Express Request declaration merging (user payload)
│   ├── validators/
│   │   ├── auth.validator.ts     # Zod schemas for admin registration & login
│   │   └── registration.validator.ts # Zod schemas for POST, PUT, PATCH, and ID params
│   ├── app.ts                    # Express application configuration & middlewares
│   └── server.ts                 # Server entry point & graceful shutdown
├── .env.example                  # Environment configuration template
├── .gitignore                    # Strict Git ignore configuration
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🚀 Getting Started & Collaboration Setup

Follow these steps to set up the backend locally:

### 1. Clone the Repository
```bash
git clone https://github.com/anesbo/workshop.git
cd workshop
```
*(If working inside the backend subfolder, navigate to `backend/`)*

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy the `.env.example` file to create your local `.env`:
```bash
cp .env.example .env
```

Edit `.env` with your actual Supabase PostgreSQL credentials:
```env
PORT=4000

# Supabase Transaction Pooler URL (Port 6543)
DATABASE_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[YOUR-REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"

# Supabase Direct Connection URL (Port 5432 - Required for Prisma Migrations)
DIRECT_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[YOUR-REGION].pooler.supabase.com:5432/postgres"

# JWT Configuration
JWT_SECRET="your-super-secure-random-jwt-secret-key-at-least-32-chars"
JWT_EXPIRES_IN="24h"
```

### 4. Run Database Migrations & Generate Prisma Client
Apply the schema to your Supabase PostgreSQL database:
```bash
# Push schema or run migration
npm run prisma:migrate -- --name init

# Generate Prisma Client types
npm run prisma:generate
```

### 5. Start the Application
- **Development mode** (with auto-reload):
  ```bash
  npm run dev
  ```
- **Production build & run**:
  ```bash
  npm run build
  npm run start
  ```

---

## 🔒 Security & Error Handling

- **Prisma Error P2002 (Unique Constraint Violation)**: Automatically mapped to `409 Conflict` with `"Email already registered for this workshop"`.
- **Prisma Error P2025 (Record Not Found)**: Automatically mapped to `404 Not Found` with `"Registration record not found"`.
- **Zod Validation Errors**: Mapped to `400 Bad Request` with field-level error messages.
- **JWT Errors & Missing Tokens**: Mapped to `401 Unauthorized`.
- **Zero Raw Error Leakage**: Stack traces and raw database internals are prevented from leaking to clients.

---

## 📡 API Reference & cURL Testing Guide

Base URL: `http://localhost:4000`

### 1. Health Check
```bash
curl -X GET http://localhost:4000/health
```
**Response (200 OK):**
```json
{
  "status": "ok",
  "timestamp": "2026-11-02T18:30:00.000Z"
}
```

---

### 2. Authentication (`/auth`)

#### A. Register Admin (`POST /auth/register`)
Creates an admin user and returns a signed JWT.
```bash
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "SecurePassword123!"
  }'
```
**Response (201 Created):**
```json
{
  "success": true,
  "message": "Admin account created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": "c1a2b3c4-d5e6-7890-abcd-ef1234567890",
    "email": "admin@example.com",
    "createdAt": "2026-11-02T18:30:00.000Z"
  }
}
```

#### B. Login Admin (`POST /auth/login`)
Authenticates credentials and returns a signed JWT.
```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "SecurePassword123!"
  }'
```
**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": "c1a2b3c4-d5e6-7890-abcd-ef1234567890",
    "email": "admin@example.com",
    "createdAt": "2026-11-02T18:30:00.000Z"
  }
}
```

---

### 3. Workshop Registrations (`/workshops/register`)

#### A. Create Registration (`POST /workshops/register`) — *Public*
Registers an attendee for the workshop. Validates format and ensures unique email.
```bash
curl -X POST http://localhost:4000/workshops/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alex",
    "secondName": "Dupont",
    "email": "alex.dupont@example.com",
    "specialite": "Cloud Architecture",
    "note": "Excited to learn backend architecture with Supabase!"
  }'
```
**Response (201 Created):**
```json
{
  "success": true,
  "message": "Registration created successfully",
  "data": {
    "id": "f81d4fae-7dec-11d0-a765-00a0c91e6bf6",
    "name": "Alex",
    "secondName": "Dupont",
    "email": "alex.dupont@example.com",
    "specialite": "Cloud Architecture",
    "note": "Excited to learn backend architecture with Supabase!",
    "createdAt": "2026-11-02T18:32:00.000Z",
    "updatedAt": "2026-11-02T18:32:00.000Z"
  }
}
```

---

#### B. Get All Registrations (`GET /workshops/register`) — *JWT Protected*
Returns all registrations ordered by `createdAt` descending.
```bash
curl -X GET http://localhost:4000/workshops/register \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```
**Response (200 OK):**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": "f81d4fae-7dec-11d0-a765-00a0c91e6bf6",
      "name": "Alex",
      "secondName": "Dupont",
      "email": "alex.dupont@example.com",
      "specialite": "Cloud Architecture",
      "note": "Excited to learn backend architecture with Supabase!",
      "createdAt": "2026-11-02T18:32:00.000Z",
      "updatedAt": "2026-11-02T18:32:00.000Z"
    }
  ]
}
```

---

#### C. Get Registration by ID (`GET /workshops/register/:id`) — *JWT Protected*
```bash
curl -X GET http://localhost:4000/workshops/register/f81d4fae-7dec-11d0-a765-00a0c91e6bf6 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```
**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "f81d4fae-7dec-11d0-a765-00a0c91e6bf6",
    "name": "Alex",
    "secondName": "Dupont",
    "email": "alex.dupont@example.com",
    "specialite": "Cloud Architecture",
    "note": "Excited to learn backend architecture with Supabase!",
    "createdAt": "2026-11-02T18:32:00.000Z",
    "updatedAt": "2026-11-02T18:32:00.000Z"
  }
}
```

---

#### D. Full Update (`PUT /workshops/register/:id`) — *JWT Protected*
Replaces all record fields. Strictly requires all 5 fields (`name`, `secondName`, `email`, `specialite`, `note`).
```bash
curl -X PUT http://localhost:4000/workshops/register/f81d4fae-7dec-11d0-a765-00a0c91e6bf6 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Alexander",
    "secondName": "Dupont-Martin",
    "email": "alex.martin@example.com",
    "specialite": "DevOps & SRE",
    "note": "Updated registration notes."
  }'
```
**Response (200 OK):**
```json
{
  "success": true,
  "message": "Registration updated successfully",
  "data": {
    "id": "f81d4fae-7dec-11d0-a765-00a0c91e6bf6",
    "name": "Alexander",
    "secondName": "Dupont-Martin",
    "email": "alex.martin@example.com",
    "specialite": "DevOps & SRE",
    "note": "Updated registration notes.",
    "createdAt": "2026-11-02T18:32:00.000Z",
    "updatedAt": "2026-11-02T18:35:00.000Z"
  }
}
```

---

#### E. Partial Update (`PATCH /workshops/register/:id`) — *JWT Protected*
Updates any subset of fields. Rejects empty request bodies.
```bash
curl -X PATCH http://localhost:4000/workshops/register/f81d4fae-7dec-11d0-a765-00a0c91e6bf6 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "specialite": "Principal SRE"
  }'
```
**Response (200 OK):**
```json
{
  "success": true,
  "message": "Registration partially updated successfully",
  "data": {
    "id": "f81d4fae-7dec-11d0-a765-00a0c91e6bf6",
    "name": "Alexander",
    "secondName": "Dupont-Martin",
    "email": "alex.martin@example.com",
    "specialite": "Principal SRE",
    "note": "Updated registration notes.",
    "createdAt": "2026-11-02T18:32:00.000Z",
    "updatedAt": "2026-11-02T18:36:00.000Z"
  }
}
```

---

#### F. Delete Registration (`DELETE /workshops/register/:id`) — *JWT Protected*
```bash
curl -X DELETE http://localhost:4000/workshops/register/f81d4fae-7dec-11d0-a765-00a0c91e6bf6 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```
**Response (200 OK):**
```json
{
  "success": true,
  "message": "Registration deleted successfully"
}
```

---

## 🧪 Error Responses

### Missing or Invalid Authorization Header (401 Unauthorized)
```json
{
  "success": false,
  "message": "Invalid authorization format. Format must be \"Bearer <token>\""
}
```

### Validation Failure (400 Bad Request)
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "path": "email",
      "message": "Invalid email address format"
    }
  ]
}
```

### Duplicate Email Conflict (409 Conflict)
```json
{
  "success": false,
  "message": "Email already registered for this workshop"
}
```

### Record Not Found (404 Not Found)
```json
{
  "success": false,
  "message": "Registration record not found"
}
```

---

## 📦 Available Scripts

| Script | Command | Description |
| :--- | :--- | :--- |
| `dev` | `npm run dev` | Runs the server in development mode using `ts-node-dev` |
| `build` | `npm run build` | Compiles TypeScript into JavaScript (`dist/`) |
| `start` | `npm run start` | Runs the compiled server from `dist/server.js` |
| `prisma:generate` | `npm run prisma:generate` | Builds Prisma Client types |
| `prisma:migrate` | `npm run prisma:migrate` | Runs Prisma schema migrations against Supabase |

---

## 🤝 Collaboration & Git Commits

All changes follow the **Conventional Commits** specification:
- `chore: initialize typescript express project and dependencies`
- `feat(prisma): add supabase schema for admin and workshop registrations`
- `feat(auth): implement JWT authentication and middleware`
- `feat(workshops): implement GET, POST, PUT, PATCH, DELETE on /workshops/register`
- `docs: add collaboration setup and API documentation`
