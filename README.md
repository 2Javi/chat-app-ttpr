# 💬 Chat App

A full-stack chat application built with React, Node.js, Express, MySQL, JWT Authentication, and Railway.

---

## 🚀 Features

### Authentication

* ✅ User Signup
* ✅ User Login (Username or Email)
* ✅ JWT Authentication
* ✅ HTTP-Only Cookie Sessions
* ✅ Protected Routes
* ✅ Session Persistence (`/me`)
* ✅ Logout
* ✅ Change Password

### Database

* ✅ MySQL Database
* ✅ Railway Remote Database
* ✅ Shared Team Database

---

## 📁 Project Structure

```txt
chat-app/

├── backend/
│   ├── config/
│   ├── controller/
│   ├── middleware/
│   ├── routes/
│   ├── database.sql
│   └── server.js
│
├── frontend/
│   └── src/
│       ├── api/
│       ├── components/
│       ├── context/
│       └── pages/
│
└── README.md
```

---

## ⚙️ Backend Setup

### 1. Navigate to Backend

```bash
cd backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create Environment File

Create a `.env` file using `.env.example`.

```env
DB_HOST=
DB_PORT=
DB_USER=
DB_PASSWORD=
DB_NAME=

JWT_SECRET=
```

### 4. Get Database Credentials

Ask the project owner for:

* Railway MySQL credentials
* JWT Secret

### 5. Start Backend

```bash
node server.js
```

Backend runs on:

```txt
http://localhost:5000
```

---

## 🎨 Frontend Setup

### 1. Navigate to Frontend

```bash
cd frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Frontend

```bash
npm run dev
```

Frontend runs on:

```txt
http://localhost:5173
```

---

## 🗄️ Database

The project uses a shared Railway MySQL database.

The file:

```txt
backend/database.sql
```

contains the database schema.

### When should I run database.sql?

✔ Run it if creating a brand-new database.

❌ Do NOT run it if using the existing shared Railway database because the table already exists.

---

## 👥 Team Workflow

### Before Starting Work

Always pull the latest changes:

```bash
git pull origin main
```

(or the team's main branch)

---

### After Making Changes

Check changes:

```bash
git status
```

Stage files:

```bash
git add .
```

Create commit:

```bash
git commit -m "Describe your changes"
```

Push branch:

```bash
git push origin <your-branch-name>
```

---

## 🔄 Keeping Your Branch Updated

Sometimes another teammate pushes changes after you've already started working.

### Example

```txt
Clone Repository
        ↓
Work on Feature
        ↓
Teammate Pushes New Code
        ↓
Local Copy Becomes Outdated
```

### Recommended Workflow

Save your work first:

```bash
git add .
git commit -m "Save current work"
```

Pull latest changes:

```bash
git pull origin main
```

Resolve conflicts if needed.

Test the application.

Push your updated branch.

---

## ⚠️ Important Notes

* Never commit `.env`
* Never share database passwords publicly
* Use `.env.example` as a guide
* Pull before starting new work
* Test before pushing
* Resolve merge conflicts before pushing

---

## 📌 Current Completed Features

* Authentication System
* JWT Cookie Authentication
* Railway MySQL Integration
* Protected Routes
* Session Persistence
* Change Password Feature

---

## 🔜 Upcoming Features

* Profile Update
* User Profile Pictures
* Email OTP Verification
* Forgot Password
* Socket.io Chat System
* Real-Time Messaging

```
```
