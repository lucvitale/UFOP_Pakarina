# Pakarina Project

---

## Project Overview

Pakarina is a centralized web platform designed for dengue monitoring, data management, and integration of multiple systems and sensors within a university environment.

The main objective of the project is to centralize fragmented data sources and provide a unified platform for:
- Data collection from sensors and external systems
- Data visualization and monitoring
- User and system management
- Future integration of dashboards, maps, and external APIs

The project is designed to be scalable and modular in order to support future extensions such as advanced analytics and hardware integrations.

---
## Tool Versions

- **Visual Studio Code** : 1.120.0
- **Git** : 2.54.0 (Windows)
- **Node.js** : 22.22.1

## Technologies Used

### Frontend
- HTML
- CSS
- JavaScript

### Backend
- Node.js
- Express.js

### Database
- MySQL

### Tools
- GitHub
- VS Code

---

## Required Software

Before starting, ensure the following tools are installed:

- [Visual Studio Code](https://code.visualstudio.com/)
- [Git](https://git-scm.com/)

---

## PC Configuration

Verify that the required tools are installed correctly:

In a terminal, write these commands :

- git --version
- node -v
- npm -v


If these commands return versions, your environment is correctly configured.

---

## Repository Setup

### 1. Open VS Code

Launch Visual Studio Code.

### 2. Open Terminal

In VS Code:
Terminal → New Terminal

### 3. Clone the repository

git clone https://github.com/lucvitale/UFOP_Pakarina.git

### 4. Navigate into the project folder

cd UFOP_Pakarina

### 5. Open the project in VS Code

code .

---
## 6. Git Configuration

If it is your first time using Git on your machine, write in your terminal :

git config --global user.email "your_email@gmail.com"

git config --global user.name "your_github_username"

---

## 7. Installation

### Backend

### Frontend

---

## 8. Running the projet 

### Backend

### Frontend

---

## Environment Variables

The backend will use a `.env` file for configuration such as:

- Database credentials
- API keys
-  Server configuration

---
  
## Development Workflow

The project uses the following Git workflow:
- `main` — stable version
- `dev` — active development
- `feature/*` — one branch per feature

Rules :
- No direct commits to `main`
- All changes go through `dev`
- Feature branches are merged via pull request

---

## Documentation

All technical documentation will be progressively stored in the `docs/` folder:
- Architecture decisions
- API documentation
- Setup guides
- Development standards

---



## 🛡️ Error Logging and Handling

### Strategy

Every error in Pakarina goes through a centralized system so nothing is lost and debugging is easy.

**Three log files are auto-generated in `backend/logs/` at runtime:**

| File | Contains |
|------|----------|
| `app.log` | Everything — INFO, WARN, ERROR |
| `error.log` | Errors only |
| `http.log` | Every HTTP request (method, URL, status, response time) |

**Log format — newline-delimited JSON:**
```json
{"timestamp":"2025-05-19T19:00:00.000Z","level":"ERROR","message":"Route not found","method":"GET","url":"/api/unknown"}
```

### How it works

1. **Every HTTP request** is logged automatically by Morgan → `logs/http.log`
2. **Warnings** (ex: unknown route) are caught by the 404 handler in `app.js` → `logs/app.log`
3. **Errors** thrown anywhere in the app use `next(err)` → caught by `middlewares/errorHandler.js` → logged to `logs/error.log` + `logs/app.log` → returns a clean JSON response to the client
4. **DB connection failures** are logged at startup

### What is logged

| Event | Logged |
|-------|--------|
| Server startup | ✅ |
| Every HTTP request | ✅ |
| 404 unknown routes | ✅ |
| Application errors | ✅ |
| DB connection success/failure | ✅ |
| SQL queries | ❌ (future sprint) |
| Auth events | ❌ (future sprint) |

### How to throw an error in a controller

```js
// Simple error
const err = new Error("Resource not found");
err.status = 404;
next(err);

// Or in a try/catch
try {
  // ... code
} catch (err) {
  next(err);
}
```

### In production

Stack traces are hidden from API responses — only logged server-side.
Set `NODE_ENV=production` in your `.env` to enable this.
