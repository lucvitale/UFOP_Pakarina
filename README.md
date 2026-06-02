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
## Git Configuration

If it is your first time using Git on your machine, write in your terminal :

git config --global user.email "your_email@gmail.com"

git config --global user.name "your_github_username"

---

##  Installation
### Backend

In a terminal :
cd backend
npm install
This installs all backend dependencies (Express, MySQL driver, dotenv, etc.).

### 
Frontend
At this stage, the frontend is purely static:

- HTML
- CSS
- JavaScript

If future frameworks are added (React, Vite, etc.) :

cd frontend
npm install

## Running the Project
### Backend
In a terminal :

cd backend
node server.js

Backend runs on: http://localhost:3000
### Frontend

Open directly :
frontend/index.html

Or use the Live Server extension in VS Code for a better experience.

---

## Environment Variables

The backend requires a `.env` file to run. This file is not included in the repository for security reasons.

### Port Overview

| Port | Role |
|------|------|
| 22 | SSH — used by PuTTY to connect remotely to the university server |
| 3306 | MySQL — used by the backend to communicate with the database |
| 3000 | Node.js — the port your local backend server runs on |

---

### Install SSH Dependency

The backend uses an SSH tunnel to connect to the university database.
Before running the project, install the required package:

```bash
cd backend
npm install ssh2
```

---



### Create the .env File

Create a `.env` file inside the `backend/` folder:

```bash
New-Item backend/.env
```

Then add the following variables:

```env
PORT=3000
DB_HOST=200.239.155.206
DB_PORT=3306
DB_NAME=microbioviews
DB_USER=root
DB_PASSWORD=nova_senha_segura
SSH_KEY_PATH=your/path/to/Edgard-EstacaoM-KeySSH.key
```

The `.env.example` file at the root of the `backend/` folder shows the exact structure expected

### SSH_KEY_PATH

The `SSH_KEY_PATH` variable must point to the SSH private key file on your local machine.

The key file is available on the shared Google Drive:
https://drive.google.com/drive/folders/17QFyrJu24gvlFaZ_sh5Gai6QpHB3KiEP

Download `Edgard-EstacaoM-KeySSH.key` and set the path accordingly.

#### Examples

Windows:
```env
SSH_KEY_PATH=C:/Users/yourname/Downloads/Edgard-EstacaoM-KeySSH.key
```

Mac/Linux:
```env
SSH_KEY_PATH=/home/yourname/Downloads/Edgard-EstacaoM-KeySSH.key
```

### Verify Connection

After configuring your `.env`, run:

```bash
cd backend
node server.js
```

Expected output:

[INFO]  Pakarina API started
🚀 Pakarina API running on http://localhost:3000
[INFO]  MySQL connected via SSH tunnel

If you see `MySQL connected via SSH tunnel`, the database connection is working correctly.

---


### Test Database Connection

To confirm the database is reachable and contains data, create a test file `backend/test-db.js`:

```bash
cd backend
New-Item test-db.js
```

```javascript
require("dotenv").config();
const { getPool } = require("./config/db");

async function test() {
  const pool = await getPool();
  const [rows] = await pool.query("SELECT * FROM noticias LIMIT 5;");
  console.log("✅ Data from noticias:", rows);
}

test().catch((err) => console.error("❌ Error:", err.message));
```

Run it:

```bash
node test-db.js
```

If you see articles displayed in the terminal, the connection is fully operational.

After testing, delete the file:

```bash
# Windows
Remove-Item test-db.js

# Mac/Linux
rm test-db.js
```

## University Server Environment

### Overview

The Pakarina project uses a university Ubuntu server for:

- Backend testing
- Python execution
- Node.js execution
- Database access
- Remote deployment validation
- Collaborative development

---

### Server Information

| Information | Value |
|---|---|
| Host | 200.239.155.206 |
| Port | 22 |
| Protocol | SSH |
| Main User | ubuntu |
| Operating System | Ubuntu 24.04 LTS |

---

### Required Software

Before connecting to the university server, install:

#### Windows

- PuTTY and private key on : https://drive.google.com/drive/folders/17QFyrJu24gvlFaZ_sh5Gai6QpHB3KiEP
- WinSCP on : https://winscp.net/eng/download.php

#### Optional Tools

- VS Code
- Git
- Node.js

---

### SSH Connection Setup (PuTTY)

#### Step 1 — Open PuTTY

Launch the PuTTY application.

---

#### Step 2 — Configure Session

| Field | Value |
|---|---|
| Host Name | 200.239.155.206 |
| Port | 22 |
| Connection Type | SSH |

---

#### Step 3 — Configure Authentication

Navigate to:

```txt
Connection > SSH > Auth > Credentials
```

In:

```txt
Private key file for authentication
```

Select the provided `.ppk` private key.

---

#### Step 4 — Configure Username

Navigate to:

```txt
Connection > Data
```

Set:

```txt
Auto-login username: ubuntu
```

---

#### Step 5 — Save Session

Return to:

```txt
Session
```

In:

```txt
Saved Sessions
```

Enter:

```txt
pakarina_server
```

Click:

```txt
Save
```

---

#### Step 6 — Connect

Click:

```txt
Open
```

At first connection, accept the SSH security alert.

---

### Successful SSH Connection Example

```txt
Using username "ubuntu".
Authenticating with public key "imported-openssh-key"

Welcome to Ubuntu 24.04.3 LTS
ubuntu@VM-EstacaoMeteorologica:~$
```

---

### WinSCP Configuration

#### Step 1 — Open WinSCP

Launch WinSCP.

---

#### Step 2 — Configure Connection

| Field | Value |
|---|---|
| Host | 200.239.155.206 |
| Port | 22 |
| User | ubuntu |

---

#### Step 3 — Configure SSH Key

Go to:

```txt
Advanced > SSH > Authentication
```

Select the `.ppk` private key.

---

#### Step 4 — Save Session

Save the configuration for future use.

---

#### Step 5 — Login

Click:

```txt
Login
```

You should now have access to the remote server files.

---

### File Transfer Validation

The following operations were successfully validated:

- File upload
- File download
- Remote file visibility
- Remote execution after upload

Collaborative deployment through WinSCP is operational.

---
### WinSCP File Transfer Test

#### Create a Local Test File

Create a simple test file on your computer.

Example:

```python
print("WinSCP transfer successful")
```

Save the file as:

```txt
test.py
```

---

#### Upload the File with WinSCP

1. Open WinSCP
2. Connect to the university server
3. Navigate to the remote directory:

```txt
/home/ubuntu
```

4. Drag and drop the `test.py` file into the remote directory

---

#### Verify File Transfer

After upload, open the SSH terminal with PuTTY and run:

```bash
ls
```

The uploaded file should appear in the directory.

Example:

```txt
test.py
```

---

#### Execute the Uploaded File

Run:

```bash
python3 test.py
```

Expected result:

```txt
WinSCP transfer successful
```

---

#### Validation Result

If the script executes successfully, this confirms:

- WinSCP file transfer is operational
- Uploaded files are accessible on the server
- Collaborative remote deployment is possible
- Python execution after upload works correctly

---

### Python Environment

#### Verify Python Installation

Run:

```bash
python3 --version
```
#### Install Python (if necessary)

Run:

```bash
sudo apt install python3 -y
```
---

#### Execute a Python Script

Example:

```python
print("Python server test successful")
```

Run:

```bash
python3 test.py
```

---

### Node.js Environment

#### Verify Installation

Run:

```bash
node -v
npm -v
```

---

#### Install Node.js (if necessary)

```bash
sudo apt install nodejs -y
sudo apt install npm -y
```

---

### MySQL Database Access

#### Connection Credentials

```txt
host=localhost
user=root
password=nova_senha_segura
```

---

#### Show Databases

```bash
mysql -u root -pnova_senha_segura -e "SHOW DATABASES;"
```

---

#### Project Database

```txt
microbioviews
```

---

#### Show Tables

```bash
mysql -u root -pnova_senha_segura -e "SHOW TABLES;" microbioviews
```

---

##### Tables Available

```txt
noticias
usuarios
favoritos
notificacoes
```

---

### Current Server Capabilities

The server currently supports:

- SSH remote administration
- Python execution
- Node.js execution
- MySQL database access
- Remote file transfer
- Collaborative deployment preparation

---
  
## Development Workflow

The project uses the following Git workflow :
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

## Error Logging and Handling

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

---

## Authentication

### Overview

This section documents the authentication strategy for the Pakarina platform, covering the chosen approach for the MVP and the planned evolution toward Google OAuth.

Two approaches were evaluated:

- Email/Password authentication (classic, self-managed)
- Google OAuth 2.0 (third-party login integration)

---

### Approaches

#### Email/Password Authentication

Users register with an email and password. The backend stores a hashed password and issues a token on successful login.

How it works:

- User submits email + password
- Backend verifies credentials against the database
- A JWT (JSON Web Token) is issued and returned to the client
- The client includes the JWT in subsequent requests (`Authorization: Bearer <token>`)

Pros:
- Full control over user data and logic
- No dependency on third-party services
- Works offline / without external APIs

Cons:
- Requires secure password storage (hashing, salting)
- Responsible for password reset flows, email verification, etc.
- More implementation work

---

#### Google OAuth 2.0

Users log in via their Google account. The backend validates the Google-issued token and creates or retrieves a local user record.

How it works:

- User clicks "Sign in with Google"
- Google handles authentication and returns an access token
- Backend validates the token via Google's API and identifies the user
- A session or JWT is issued locally

Pros:
- Removes password management entirely
- Faster onboarding for users (no registration form)
- Google handles security (2FA, breach detection, etc.)

Cons:
- Requires a Google Cloud project and OAuth credentials
- Users without a Google account are excluded (unless a fallback exists)
- Adds dependency on Google's API availability

---

### Comparison

| Criteria | Email/Password | Google OAuth 2.0 |
|----------|---------------|------------------|
| Implementation complexity | Medium | Medium-High |
| User experience | Standard | Smoother |
| Security responsibility | Team | Shared with Google |
| External dependency | None | Google API |
| Password management | Required | Not required |
| Suitable for MVP | Yes | Possible but heavier |

---

### Recommended Solution

**Chosen approach: Email/Password authentication with JWT, with Google OAuth prepared for a future sprint.**

Rationale:
- No external API setup required
- Fully controllable and testable locally
- Sufficient for the current MVP scope

Google OAuth can be added later using Passport.js without major architecture changes.

---

### Required Libraries

#### Backend

```bash
npm install bcrypt jsonwebtoken passport passport-local passport-google-oauth20
```

| Package | Role |
|---------|------|
| `bcrypt` | Password hashing |
| `jsonwebtoken` | JWT generation and verification |
| `passport` | Authentication middleware |
| `passport-local` | Email/password strategy |
| `passport-google-oauth20` | Google OAuth (future sprint) |

#### Frontend

No additional libraries required for MVP. Uses the native `fetch` API with in-memory JWT storage.

---

### Security Considerations

#### Password Storage
- Never store passwords in plain text
- Use bcrypt with salt (min cost factor 10)

#### JWT
- Short expiration time (1h or less)
- Store secret in `.env`
- Avoid exposing tokens in insecure storage

#### Client Storage
- Avoid `localStorage` (XSS risk)
- Prefer `httpOnly` cookies or in-memory storage

#### Transport Security
- HTTPS required in production
- Use `helmet` middleware for secure headers

#### Google OAuth (future)
- Never expose client secret on frontend
- Validate state parameter (CSRF protection)
- Restrict redirect URIs in Google console

---

### Implementation Plan

#### Phase 1 — Email/Password + JWT (MVP)

- Create `users` table (`id`, `email`, `password_hash`, `created_at`)
- Register endpoint: `POST /api/auth/register`
- Login endpoint: `POST /api/auth/login`
- JWT middleware for protected routes
- Test protected route

#### Phase 2 — Google OAuth (future sprint)

- Create Google Cloud project
- Configure OAuth credentials
- Add `passport-google-oauth20` strategy
- Add `/auth/google` routes
- Link or create user in database
- Issue JWT after login

---

### References

- JWT: https://jwt.io/introduction
- bcrypt: https://www.npmjs.com/package/bcrypt
- Passport.js: https://www.passportjs.org/
- Google OAuth: https://developers.google.com/identity/protocols/oauth2

---

### Chosen Implementation

For Sprint 1, email/password authentication with JWT was implemented.

- Passwords are hashed using bcrypt (10 salt rounds)
- JWT tokens are generated on login and expire after 24 hours
- A middleware validates the token on protected routes
- Login and register pages are available in EN, FR, ES, and PT
- Google OAuth architecture is prepared for a future sprint

---

### Environment Variable

Add the following line to your `.env` file:

```env
JWT_SECRET=your_jwt_secret_key
```

Choose a long and random string for security. You can generate one with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```