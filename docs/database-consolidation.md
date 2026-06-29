# Database Consolidation — Pakarina Project

**Database:** microbioviews
**System:** MySQL (university server via SSH tunnel)
**Sprint:** Sprint 3
**Author:** RB (Raphael)

---

## Objective

Validate the production database state, confirm data persistence, document the current structure, and propose performance optimizations for historical data growth.

---

## 1. Production Data Validation

The production database is populated with real data collected by the platform:

| Table | Rows | Source |
|-------|------|--------|
| `noticias` | 393 | News scraping system (automatic) |
| `usuarios` | 2 | User registration (auth system) |
| `favoritos` | 3 | User saved search terms |
| `notificacoes` | 532 | Generated from favorites |

✅ **Production database is populated with real data.**

---

## 2. Current Structure & Indexes

### noticias
| Column | Type | Key |
|--------|------|-----|
| id | int | PRIMARY |
| titulo | varchar(255) | |
| link | varchar(700) | UNIQUE |
| jornal | varchar(100) | |
| data_publicacao | varchar(100) | |
| lat | double | |
| lon | double | |
| local_nome | varchar(150) | |
| termo_busca | varchar(100) | |
| momento_coleta | datetime | |
| resumo | text | |

Indexes: `PRIMARY (id)`, `UNIQUE (link)` — prevents duplicate articles from scraping.

### usuarios
| Column | Type | Key |
|--------|------|-----|
| id | int | PRIMARY |
| nome | varchar(100) | |
| email | varchar(150) | UNIQUE |
| senha | varchar(255) | hashed (bcrypt) |

Indexes: `PRIMARY (id)`, `UNIQUE (email)` — required for authentication.

### favoritos
Indexes: `PRIMARY (id)`, `INDEX (usuario_id)` — FK to usuarios.

### notificacoes
Indexes: `PRIMARY (id)`, `INDEX (usuario_id)` — FK to usuarios.

---

## 3. Data Persistence

- Persistence is handled by MySQL on the university server.
- The backend connects via an SSH tunnel (see README).
- Connection uses a pool (`connectionLimit: 10`) with keep-alive enabled, ensuring stable reuse of connections and automatic reconnection if the tunnel drops.

✅ **Data persistence mechanisms are operational.**

---

## 4. Recommended Optimizations (to be reviewed by team)

> ⚠️ These changes modify the production schema and must be discussed with the team before applying. Not applied unilaterally.

| Table | Proposed index | Reason |
|-------|----------------|--------|
| `noticias` | INDEX on `local_nome` | News module filters by location frequently |
| `noticias` | INDEX on `termo_busca` | Search queries filter by term |
| `notificacoes` | INDEX on `lida` | Unread notifications are queried per user |

Example (for future application after team agreement):
```sql
CREATE INDEX idx_noticias_local ON noticias(local_nome);
CREATE INDEX idx_noticias_termo ON noticias(termo_busca);
CREATE INDEX idx_notif_lida ON notificacoes(lida);
```

---

## 5. Historical Storage Preparation

For future historical data growth:
- `momento_coleta` (datetime) already timestamps every collected article — enables time-based historical queries.
- `data_aviso` (datetime) timestamps notifications.
- **Recommendation:** when `noticias` grows large (>100k rows), consider partitioning by `momento_coleta` (monthly) or archiving old rows to a `noticias_historico` table.

---

## 6. Performance Validation

- Current dataset (393 news, 532 notifications) returns queries instantly.
- Existing indexes cover all primary access patterns (id lookups, unique link/email checks, user FKs).
- Proposed indexes above would maintain performance as data grows.

✅ **Database performance validated for current scale.**

---

*Last updated: Sprint 3 — Database Consolidation*
