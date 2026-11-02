# Workshop Management REST API (Next.js App Router)

Production-ready REST API backend built with **Next.js (App Router)**, **TypeScript**, **Prisma ORM**, and **Supabase (PostgreSQL)**.

---

## 🛠 Tech Stack

- **Framework**: Next.js (App Router API Route Handlers)
- **Language**: TypeScript
- **Database & ORM**: PostgreSQL (Supabase) with Prisma ORM
- **Data Validation**: Zod schema validation
- **Dev Tools**: Turbopack, tsx, prisma

---

## 📁 Project Architecture

```
backend/
├── prisma/
│   └── schema.prisma                  # Supabase PostgreSQL schema (Registration model)
├── src/
│   ├── app/
│   │   ├── health/
│   │   │   └── route.ts               # GET /health
│   │   ├── workshops/
│   │   │   └── register/
│   │   │       ├── route.ts           # GET, POST /workshops/register
│   │   │       └── [id]/
│   │   │           └── route.ts       # GET, PUT, PATCH, DELETE /workshops/register/:id
│   │   ├── layout.tsx                 # Root layout
│   │   └── page.tsx                   # API status dashboard
│   ├── lib/
│   │   ├── prisma.ts                  # Singleton PrismaClient instance (Hot-reload safe)
│   │   └── errors.ts                  # Centralized error handler (Zod, Prisma P2002/P2025)
│   └── validators/
│       └── registration.validator.ts  # Zod schemas for POST, PUT, PATCH, and ID params
├── .env.example                       # Environment configuration template
├── .gitignore                         # Strict Git ignore configuration
├── next.config.mjs                    # Next.js configuration
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🚀 Getting Started & Collaboration Setup

### 1. Clone the Repository
```bash
git clone https://github.com/anesbo/workshop.git
cd workshop
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to create your local `.env`:
```bash
cp .env.example .env
```

Edit `.env` with your Supabase PostgreSQL credentials:
```env
PORT=3000

# Supabase Transaction Pooler URL (Port 6543)
DATABASE_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[YOUR-REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"

# Supabase Direct Connection URL (Port 5432 - Required for Prisma Migrations)
DIRECT_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[YOUR-REGION].pooler.supabase.com:5432/postgres"
```

### 4. Run Migrations & Generate Prisma Client
```bash
# Push schema or run migration
npm run prisma:migrate -- --name init

# Generate Prisma Client types
npm run prisma:generate
```

### 5. Start the Application
- **Development mode** (with auto-reload on `http://localhost:3000`):
  ```bash
  npm run dev
  ```
- **Production build & run**:
  ```bash
  npm run build
  npm run start
  ```

---

## 📡 API Reference & cURL Testing Guide

Base URL: `http://localhost:3000`

### 1. Health Check (`GET /health`)
```bash
curl -X GET http://localhost:3000/health
```
**Response (200 OK):**
```json
{
  "status": "ok",
  "timestamp": "2026-11-02T19:35:00.000Z"
}
```

---

### 2. Workshop Registrations (`/workshops/register`)

#### A. Create Registration (`POST /workshops/register`)
Registers a new attendee for the workshop. Validates format and checks unique email constraint.
```bash
curl -X POST http://localhost:3000/workshops/register \
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
    "createdAt": "2026-11-02T19:35:00.000Z",
    "updatedAt": "2026-11-02T19:35:00.000Z"
  }
}
```

---

#### B. Get All Registrations (`GET /workshops/register`)
Returns all workshop registrations ordered by `createdAt` descending.
```bash
curl -X GET http://localhost:3000/workshops/register
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
      "createdAt": "2026-11-02T19:35:00.000Z",
      "updatedAt": "2026-11-02T19:35:00.000Z"
    }
  ]
}
```

---

#### C. Get Registration by ID (`GET /workshops/register/:id`)
```bash
curl -X GET http://localhost:3000/workshops/register/f81d4fae-7dec-11d0-a765-00a0c91e6bf6
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
    "createdAt": "2026-11-02T19:35:00.000Z",
    "updatedAt": "2026-11-02T19:35:00.000Z"
  }
}
```

---

#### D. Full Update (`PUT /workshops/register/:id`)
Performs a full replacement of a registration. Strictly requires all 5 fields (`name`, `secondName`, `email`, `specialite`, `note`).
```bash
curl -X PUT http://localhost:3000/workshops/register/f81d4fae-7dec-11d0-a765-00a0c91e6bf6 \
  -H "Content-Type: application/json" \
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
    "createdAt": "2026-11-02T19:35:00.000Z",
    "updatedAt": "2026-11-02T19:36:00.000Z"
  }
}
```

---

#### E. Partial Update (`PATCH /workshops/register/:id`)
Updates any subset of fields. Rejects empty request payloads.
```bash
curl -X PATCH http://localhost:3000/workshops/register/f81d4fae-7dec-11d0-a765-00a0c91e6bf6 \
  -H "Content-Type: application/json" \
  -d '{
    "specialite": "Principal Cloud Architect"
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
    "specialite": "Principal Cloud Architect",
    "note": "Updated registration notes.",
    "createdAt": "2026-11-02T19:35:00.000Z",
    "updatedAt": "2026-11-02T19:37:00.000Z"
  }
}
```

---

#### F. Delete Registration (`DELETE /workshops/register/:id`)
```bash
curl -X DELETE http://localhost:3000/workshops/register/f81d4fae-7dec-11d0-a765-00a0c91e6bf6
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

### Validation Error (400 Bad Request)
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
| `dev` | `npm run dev` | Runs the Next.js development server with Turbopack |
| `build` | `npm run build` | Builds the Next.js application for production |
| `start` | `npm run start` | Runs the production build |
| `prisma:generate` | `npm run prisma:generate` | Generates Prisma Client types |
| `prisma:migrate` | `npm run prisma:migrate` | Applies database migrations with Supabase |
