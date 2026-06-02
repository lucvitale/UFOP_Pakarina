# Authentication Flow — Pakarina Project

**Sprint:** Sprint 1  
**Branch:** feature/authentication  

---

## Strategy

Email/password authentication using JWT (JSON Web Tokens).  
Google OAuth integration is planned for a future sprint.

---

## Flow

### Registration
1. User submits name, email, and password via `/api/auth/register`
2. Backend checks if email already exists in `usuarios` table
3. Password is hashed using bcrypt (10 salt rounds)
4. User is saved in the database
5. Success response returned

### Login
1. User submits email and password via `/api/auth/login`
2. Backend retrieves user from `usuarios` table by email
3. bcrypt compares submitted password with stored hash
4. If valid → JWT token generated (expires in 24h)
5. Token returned to frontend with user info
6. Frontend stores token in localStorage

### Protected Routes
1. Frontend sends JWT in `Authorization: Bearer <token>` header
2. `auth.middleware.js` intercepts the request
3. JWT is verified using `JWT_SECRET`
4. If valid → request proceeds with `req.user` populated
5. If invalid → 401/403 response returned

---

## Endpoints

| Method | Route | Description | Auth required |
|--------|-------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login and get JWT | No |
| GET | `/api/protected` | Test protected route | Yes |

---

## Security

- Passwords hashed with bcrypt (10 salt rounds)
- JWT signed with `JWT_SECRET` from `.env`
- JWT expires after 24 hours
- Passwords never returned in API responses

---

## Google OAuth — Future Integration

Google OAuth is planned for a future sprint.  
The authentication middleware is designed to support multiple strategies.

Steps planned:
- Register app on Google Cloud Console
- Implement OAuth2 callback route
- Link Google account to existing `usuarios` table

---

## Files

| File | Role |
|------|------|
| `backend/controllers/auth.controller.js` | Register and login logic |
| `backend/routes/auth.routes.js` | Auth routes definition |
| `backend/middlewares/auth.middleware.js` | JWT verification middleware |
| `frontend/pages/login.html` | Login form |
| `frontend/pages/register.html` | Register form |
| `frontend/js/auth.js` | Frontend auth logic |