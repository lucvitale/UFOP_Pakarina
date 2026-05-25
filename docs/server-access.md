# University Server Access — Technical Report

**Date:** 2026-05-25  
**Author:** Hugo  
**Branch:** feature/university-server-access  
**Sprint:** Sprint 1  

---

# Objective

Validate access to the university development server environment and evaluate collaborative deployment possibilities for the Pakarina project.

---

# Server Information

| Information | Value |
|---|---|
| Host | 200.239.155.206 |
| Port | 22 |
| Protocol | SSH |
| Operating System | Ubuntu 24.04.3 LTS |
| Main User | ubuntu |
| Authentication | SSH private key (.ppk) |

---

# Tools Used

- PuTTY
- WinSCP
- MySQL
- Node.js
- npm
- Python 3

---

# Connection Validation

## PuTTY SSH Connection

SSH access was successfully validated using PuTTY.

## Configuration Used

```txt
Host: 200.239.155.206
Port: 22
User: ubuntu
Authentication: SSH private key (.ppk)
```

## Validation Results

- SSH authentication successful
- Remote terminal access fully operational
- Stable server connectivity confirmed
- Linux commands executed successfully
- Remote environment accessible without errors

The server responded correctly and terminal access was fully functional.

---

# File Transfer Validation

## WinSCP Connection

WinSCP access was successfully validated using the same SSH private key authentication.

## Validation Performed

- SSH authentication validated
- Remote server directories accessible
- File upload successfully tested
- Uploaded files visible from server terminal
- Remote file management operational

## Transfer Test Result

A Python test file was uploaded to the server using WinSCP and executed successfully through the SSH terminal.

This confirms that collaborative deployment and remote file transfer are technically possible for the Pakarina project.

---

# Permissions Validation

Validated:
- Read permissions
- Terminal access
- Package installation permissions
- Python execution permissions
- Node.js execution permissions
- MySQL access permissions

---

# Database Validation

## Database Identified

Database available on server:

```sql
microbioviews
```
## Tables Found

```sql
noticias
usuarios
favoritos
notificacoes
```

## MySQL Access 

Successfully connected to MySQL using:

```sql
host=localhost
user=root
```

Database queries executed successfully.

---

# Python Environment Validation

Python environment tested successfully.

## Validation Performed
- Python installation verified
- Python script executed successfully
- File execution permissions validated

## Example Test

```python
print("Python server test successful")
```
## Execution Result

The script executed successfully on the university server through the SSH terminal.

---

# Node.js Environment Validation

Node.js environment validated successfully.

## Validation Performed
- Node.js installation completed
- npm installation completed
- JavaScript execution validated

## Example test:


```javascript
console.log("Node.js server environment working");
```

## Execution Result

Node.js and npm were successfully installed and validated on the server environment.

---

# File Transfer Validation

WinSCP connection tested successfully.

## Validation Performed
- SSH authentication validated
- File upload tested successfully
- Uploaded files accessible from server terminal

Collaborative deployment through file transfer is technically possible.

---

# Server Resources

| Information | Value |
|---|---|
| Host | 200.239.155.206 |
| Port | 22 |
| Protocol | SSH |
| Operating System | Ubuntu 24.04.3 LTS |
| Main User | ubuntu |
| Authentication | SSH private key (.ppk) |

| Resource | Status |
|---|---|
| Disk Usage | 40% used |
| Memory Usage | 36% used |
| Active Processes | 120 |
| Connectivity	| Stable |

---

# Technical Limitations Identified
- Node.js environment was not pre-installed
- Server shared between multiple university projects
- Limited available storage space
- Collaborative validation with all members still pending
- Deployment strategy not yet standardized

---

# Deployment Possibilities Evaluated

The following deployment possibilities were validated:

- Python script execution
- Node.js backend execution
- File transfer through WinSCP
- MySQL database access
- SSH remote administration

---

# Collaborative Access Validation

Initial collaborative access process prepared.

Server configuration and connection documentation were shared with the team for future collaborative validation.

Additional member validations will be completed during this sprint.

---

# Conclusion

The university server environment is accessible and operational for the Pakarina project.

The infrastructure currently supports:

- Backend development
- Database access
- Python execution
- Node.js execution
- Remote administration
- Collaborative deployment preparation

The environment is considered technically usable for Sprint 1 development activities.