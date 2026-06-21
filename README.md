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

## Dengue Risk Logic — Climate Indicators

### Why this exists

The Climate page calculates a real-time dengue risk level (Low / Medium / High) for a given location, based on four weather variables: temperature, relative humidity, wind speed, and precipitation. 

This section explains why these specific variables and their thresholds were chosen and the general direction in which each one affects risk.

The thresholds are not invented — they are derived from entomological research on
*Aedes aegypti*, the main mosquito species responsible for dengue transmission. Each
variable affects a different part of the mosquito life cycle (adult survival, larval
development, flight behavior, or breeding site formation), so each one needed its own
justification.

### Variables used and why

**Temperature** 

| Range | Risk level | Reasoning |
|---|---|---|
| < 10°C | Very low | Larvae generally fail to develop below this threshold. |
| 10–20°C | Low | Mosquito activity and reproduction are slowed but not stopped. |
| 20–25°C | Medium | Activity and reproduction increase progressively. |
| 25–35°C | High | This is the optimal range for *Aedes* survival, development, and reproduction. |
| > 35°C | Extreme (reduced risk) | Adult survival and larval development drop sharply; above 40°C adults die and eggs/larvae stop developing. |

Multiple independent studies converge on a 25–30°C (sometimes extended to 22–32°C)
optimum for development, longevity, and fecundity, with a sharp decline above 35–40°C.
This justifies treating 25–35°C as the highest-risk band rather than assuming "hotter is
always worse."

**Sources:**
- Reiskind & Zarrabi (2012), cited in *Frontiers in Cellular and Infection Microbiology* (2023) — optimal development range 25–30°C, mortality above 40°C: https://www.frontiersin.org/journals/cellular-and-infection-microbiology/articles/10.3389/fcimb.2023.1242173/full
- Marinho et al. (2016), *Journal of Vector Ecology* — optimal range for development, longevity and fecundity between 22–32°C: https://onlinelibrary.wiley.com/doi/full/10.1111/jvec.12187
- Sok et al., *Parasites & Vectors* — highest egg-hatching rate for *Ae. aegypti* at 25°C; larvae do not survive past first instar at 40°C: https://link.springer.com/article/10.1186/s13071-025-06892-y


**Relative humidity**

| Range | Risk level | Reasoning |
|---|---|---|
| 0–40% | Low | Dry air is unfavorable for mosquito survival and reproduction. |
| 40–60% | Medium | Partially favorable conditions. |
| > 60% | High | Clearly favors survival and reproduction. |

Field studies consistently find a positive correlation between relative humidity and
*Aedes aegypti* density / breeding indices, and at moderate temperatures higher humidity
specifically increases survival rates.

**Sources:**
- Density study in Antioquia, Colombia, *PLOS ONE* / PMC — significant correlation between vector density and relative humidity: https://pmc.ncbi.nlm.nih.gov/articles/PMC10810462/
- Climate study, Punjab, Pakistan — at moderate temperatures (20–30°C), higher relative humidity increased survival rates: https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12112272/


**Wind speed** 

| Range | Risk level | Reasoning |
|---|---|---|
| < 3 m/s | High | Mosquitoes remain active and can fly/feed normally. |
| > 3 m/s | Low | Wind disrupts flight and feeding activity, reducing effective mosquito activity. |

This reflects a well-documented behavioral effect rather than a survival effect: wind does not kill mosquitoes, but it physically limits their ability to fly and locate hosts, which lowers real-world biting/breeding activity even when temperature and humidity are otherwise favorable.

**Precipitation** 

| Range | Risk level | Reasoning |
|---|---|---|
| 0–5 mm | Low | No significant water accumulation; low breeding-site risk. |
| 5–20 mm | Medium | Can create stagnant water, favoring larval breeding sites. |
| > 20 mm | High | Strongly increases the number of potential breeding sites. |

Precipitation's effect on dengue risk is more nuanced than temperature or humidity: moderate rainfall creates the standing water *Aedes* needs to breed, but very heavy rainfall can flush away eggs and larvae. Since *Aedes aegypti* breeds mostly in artificial, often indoor or sheltered containers (rather than open outdoor pools), it is comparatively less affected by rain-flushing than mosquito species that breed outdoors — which is why the model treats higher precipitation as increasing rather than decreasing
risk.

**Sources:**
- Systematic review & meta-analysis, *PMC* — heavy rainfall can flush away immature mosquito stages short-term, but precipitation creates breeding-favorable conditions
  long-term: https://pmc.ncbi.nlm.nih.gov/articles/PMC9767811/
- Sri Lanka prediction model study — Breteau Index (breeding-site density) correlated with rainfall, premise/ovitrap indices correlated with humidity: https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9810403/

  ### Limitations / notes for contributors

- These thresholds describe conditions favorable to the *mosquito vector*, not a direct
  measurement of dengue case incidence — risk level is a proxy, not an epidemiological
  forecast.
- Thresholds were synthesized from multiple studies conducted in different countries
  (Cambodia, Brazil, Pakistan, Colombia, Sri Lanka) with *Aedes aegypti* and sometimes
  *Aedes albopictus*; exact optimal values vary slightly by population/region, so the
  ranges used here are intentionally conservative midpoints rather than a single study's
  exact figures.
- If thresholds are adjusted in the future, update both the code (`climate.js`) and this
  table together so they don't drift apart.

  **Additional sources :**

- Climate change and dengue: a critical and systematic review of quantitative modelling approaches : https://link.springer.com/article/10.1186/1471-2334-14-167

- Associations between climatic variables and dengue incidence in high-burden countries: a systematic review and meta-analysis : https://www.frontiersin.org/journals/climate/articles/10.3389/fclim.2026.1804553/full

- Factors influencing establishment of dengue fever vectors in urban areas : https://www.emro.who.int/emhj-volume-31-2025/volume-31-issue-3/factors-influencing-establishment-of-dengue-fever-vectors-in-urban-areas.html

- The association between dengue case and climate: A systematic review and meta-analysis : https://pmc.ncbi.nlm.nih.gov/articles/PMC9767811/

- A Systematic Review and Meta-Analysis of Dengue Risk with Temperature Change : https://pmc.ncbi.nlm.nih.gov/articles/PMC4306847/

- DENGUE SEASONALITY AND NON-MONOTONIC RESPONSE TO MOISTURE: A MODEL-DATA ANALYSIS OF SRI LANKA INCIDENCE FROM 2011 TO 2016 : https://arxiv.org/pdf/2009.02847

- Dengue World Health Organization : https://www.who.int/news-room/fact-sheets/detail/dengue-and-severe-dengue

- The global distribution and burden of dengue : https://pubmed.ncbi.nlm.nih.gov/23563266/

- The overlapping global distribution of dengue, chikungunya, Zika and yellow fever : https://pubmed.ncbi.nlm.nih.gov/40210848/

- Dengue Fever : https://www.ncbi.nlm.nih.gov/books/NBK430732/

- Epidemiology of dengue: past, present and future prospects : https://pmc.ncbi.nlm.nih.gov/articles/PMC3753061/

- Dengue: global situation, surveillance and progress – 2024 update : https://iris.who.int/server/api/core/bitstreams/b405cbfa-3642-4da1-a45e-627c58cec6f2/content


### News Module

#### Purpose

The News Module allows users to search for dengue and arbovirus-related news articles collected from external sources and stored in the project's database.

The objective is to provide quick access to epidemiological information associated with specific locations and help users monitor recent dengue-related events.

---

#### Features

- Search news articles by city, region, or country.
- Display article title, source, publication date, location, and summary.
- Open the original article in a new browser tab.
- Support multiple languages through the project's internationalization system (English, French, Spanish, and Portuguese).

---

#### No Results Handling

If no news articles are found for the requested location:

1. A translated message informs the user that no articles are currently available for that search.
2. The system automatically retrieves all locations currently present in the database.
3. These available locations are displayed as clickable buttons.

---

#### Interactive Suggestions

When available locations are displayed, users can click directly on any suggested location.

The application automatically launches a new search for the selected location, making navigation easier without requiring manual input.

---

#### Dynamic Content

The list of available locations is generated dynamically from the `noticias` database table.

As new locations are added by the news collection system, they automatically become available in the interface without requiring any code modification.


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

The backend uses a centralized logging system for debugging and traceability.

**Three log files are auto-generated in `backend/logs/` at runtime:**

| File | Contains |
|------|----------|
| `app.log` | Everything — INFO, WARN, ERROR |
| `error.log` | Errors only |
| `http.log` | Every HTTP request |

For full documentation see [`docs/logging.md`](docs/logging.md).