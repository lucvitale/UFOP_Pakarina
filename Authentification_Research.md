# Authentication Research and Preparation

Project: Pakarina — Dengue Monitoring Platform (UFOP)  

---

## 1. Overview

This document evaluates authentication strategies for the Pakarina platform. The goal is to identify the most suitable approach for securing user access, considering the project's current stack (Node.js/Express backend, HTML/CSS/JS frontend), team size, and roadmap.

Two main approaches are evaluated:

- Email/Password authentication (classic, self-managed)
- Google OAuth 2.0 (third-party login integration)

---

## 2. Authentication Approaches

### 2.1 Email/Password Authentication

Users register with an email and password. The backend stores a hashed password and issues a token on successful login.

How it works:

- User submits email + password
- Backend verifies credentials against the database
- A JWT (JSON Web Token) is issued and returned to the client
- The client includes the JWT in subsequent requests (Authorization: Bearer <token>)

Pros:

- Full control over user data and logic
- No dependency on third-party services
- Works offline / without external APIs

Cons:

- Requires secure password storage (hashing, salting)
- Responsible for password reset flows, email verification, etc.
- More implementation work

---

### 2.2 Google OAuth 2.0

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

## 3. Comparison Table

| Criteria | Email/Password | Google OAuth 2.0 |
|----------|---------------|------------------|
| Implementation complexity | Medium | Medium-High |
| User experience | Standard | Smoother |
| Security responsibility | Team | Shared with Google |
| External dependency | None | Google API |
| Password management | Required | Not required |
| Suitable for MVP | Yes | Possible but heavier |

---

## 4. Recommended Solution

Recommended approach: Email/Password authentication with JWT, with Google OAuth prepared for a future sprint.

Rationale:

- No external API setup required
- Fully controllable and testable locally
- Sufficient for the current MVP scope

Google OAuth can be added later using Passport.js without major architecture changes.

---

## 5. Required Libraries and APIs

### Backend

- bcrypt → password hashing
- jsonwebtoken → JWT generation and verification
- passport → authentication middleware
- passport-local → email/password strategy
- passport-google-oauth20 → Google OAuth (future)

Install:

npm install bcrypt jsonwebtoken passport passport-local passport-google-oauth20

---

### Frontend

No additional libraries required for MVP.

Uses:

- fetch API
- sessionStorage or in-memory JWT storage

---

### External APIs (future)

Google OAuth 2.0:

- Google Cloud Console project required
- OAuth credentials (Client ID / Client Secret)
- https://developers.google.com/identity/protocols/oauth2

---

## 6. Security Considerations

### Password Storage

- Never store passwords in plain text
- Use bcrypt with salt (min cost factor 10)

### JWT

- Short expiration time (1h or less)
- Store secret in .env
- Avoid exposing tokens in insecure storage

### Client Storage

- Avoid localStorage (XSS risk)
- Prefer httpOnly cookies or in-memory storage

### Transport Security

- HTTPS required in production
- Use helmet middleware for secure headers

### Google OAuth (future)

- Never expose client secret on frontend
- Validate state parameter (CSRF protection)
- Restrict redirect URIs in Google console

---

## 7. Implementation Plan

### Phase 1 — Email/Password + JWT

- Create users table (id, email, password_hash, created_at)
- Register endpoint (POST /api/auth/register)
- Login endpoint (POST /api/auth/login)
- JWT middleware for protected routes
- Test protected route

---

### Phase 2 — Google OAuth (future)

- Create Google Cloud project
- Configure OAuth credentials
- Add passport-google-oauth20 strategy
- Add /auth/google routes
- Link or create user in database
- Issue JWT after login

---

## 8. References

- JWT: https://jwt.io/introduction
- bcrypt: https://www.npmjs.com/package/bcrypt
- Passport.js: https://www.passportjs.org/
- Google OAuth: https://developers.google.com/identity/protocols/oauth2
- OWASP Authentication Guide: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html