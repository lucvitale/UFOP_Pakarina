# Logging & Monitoring — Pakarina Project

**Sprint:** Sprint 1  
**Branch:** feature/logging-system  

---

## Overview

Every event in the Pakarina backend goes through a centralized logging system so nothing is lost and debugging is easy.

---

## Log Files

Three log files are auto-generated in `backend/logs/` at runtime:

| File | Contains |
|------|----------|
| `app.log` | Everything — INFO, WARN, ERROR |
| `error.log` | Errors only |
| `http.log` | Every HTTP request (method, URL, status, response time) |

---

## Log Levels

| Level | Usage |
|-------|-------|
| INFO | Normal events (server start, user login, user register) |
| WARN | Suspicious events (unknown route, invalid token) |
| ERROR | Application errors (DB failure, unhandled exceptions) |

---

## Log Format

Newline-delimited JSON:

```json
{
  "timestamp": "2026-06-02T20:00:00.000Z",
  "level": "INFO",
  "message": "User logged in",
  "email": "user@example.com"
}
```

---

## What is Logged

| Event | Level | File |
|-------|-------|------|
| Server startup | INFO | app.log |
| MySQL connection success | INFO | app.log |
| MySQL connection failure | ERROR | app.log + error.log |
| Every HTTP request | INFO | http.log |
| Unknown route (404) | WARN | app.log |
| User registered | INFO | app.log |
| User logged in | INFO | app.log |
| Invalid JWT token | WARN | app.log |
| Application errors | ERROR | app.log + error.log |

---

## How to Use the Logger

```javascript
const { logger } = require("./config/logger");

logger.info("Something happened", { extra: "data" });
logger.warn("Something suspicious", { url: req.url });
logger.error("Something broke", { error: err.message });
```

---

## How to Throw an Error

```javascript
// Simple error
const err = new Error("Resource not found");
err.status = 404;
next(err);

// In a try/catch
try {
  // code
} catch (err) {
  next(err);
}
```

---

## Files

| File | Role |
|------|------|
| `backend/config/logger.js` | Logger definition and Morgan HTTP middleware |
| `backend/middlewares/errorHandler.js` | Centralized error handler |
| `backend/logs/app.log` | General log file |
| `backend/logs/error.log` | Error log file |
| `backend/logs/http.log` | HTTP request log file |

---

## Future Improvements

- SQL query logging
- Auth event dashboard
- Log rotation for production
- External monitoring integration (e.g. Datadog, Sentry)