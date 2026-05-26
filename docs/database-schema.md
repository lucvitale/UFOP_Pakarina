# Database Schema — Pakarina Project

**Database name:** microbioviews  
**System:** MySQL  
**Server:** 200.239.155.206  
**Sprint:** Sprint 1  

---

## Entities

### noticias (News Articles)

Stores news articles collected automatically from external sources.

| Column | Type | Description |
|--------|------|-------------|
| id | int (PK) | Unique identifier |
| titulo | varchar(255) | Article title |
| link | varchar(700) | Article URL (unique) |
| jornal | varchar(100) | Source journal |
| data_publicacao | varchar(100) | Publication date |
| lat | double | Latitude of related location |
| lon | double | Longitude of related location |
| local_nome | varchar(150) | Location name |
| termo_busca | varchar(100) | Search term used to find article |
| momento_coleta | datetime | Collection timestamp |
| resumo | text | Article summary |

---

### usuarios (Users)

Stores registered platform users.

| Column | Type | Description |
|--------|------|-------------|
| id | int (PK) | Unique identifier |
| nome | varchar(100) | Full name |
| email | varchar(150) | Email address (unique) |
| senha | varchar(255) | Hashed password |

---

### favoritos (Favorites)

Stores search terms saved as favorites by users.

| Column | Type | Description |
|--------|------|-------------|
| id | int (PK) | Unique identifier |
| usuario_id | int (FK → usuarios.id) | Reference to user |
| termo | varchar(100) | Saved search term |

---

### notificacoes (Notifications)

Stores notifications sent to users based on their favorite terms.

| Column | Type | Description |
|--------|------|-------------|
| id | int (PK) | Unique identifier |
| usuario_id | int (FK → usuarios.id) | Reference to user |
| titulo_noticia | varchar(255) | Related article title |
| link_noticia | varchar(700) | Related article URL |
| termo_origem | varchar(100) | Search term that triggered notification |
| lida | tinyint(1) | Read status (0 = unread, 1 = read) |
| data_aviso | datetime | Notification timestamp |

---

## Relationships

- A **usuario** can have many **favoritos** (1:N)
- A **usuario** can have many **notificacoes** (1:N)
- A **notificacao** references a **noticia** via link (no FK — loose coupling)
- **noticias** are independent — collected automatically by the system

---

## Notes

- Database name on server is `microbioviews` 
- Backend connects to this database via SSH tunnel (see README for setup)
- Authentication fields (`email`, `senha`) in `usuarios` are ready for Sprint 1 authentication implementation