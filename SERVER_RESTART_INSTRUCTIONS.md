# Server Restart Instructions

## 🔒 Secure Server Start (Recommended)

### Step 1: Stop the Current Server
In the terminal where the server is running, press:
```
Ctrl + C
```

### Step 2: Start Server with Localhost Binding
Run this command in PowerShell:
```powershell
python -m http.server 8000 --bind 127.0.0.1
```

### Step 3: Verify
You should see:
```
Serving HTTP on 127.0.0.1 port 8000 (http://127.0.0.1:8000/) ...
```

### Step 4: Access Your Site
Open your browser to:
```
http://localhost:8000
```

---

## 🔍 What This Does

**Before** (without `--bind`):
- Server listens on all network interfaces (`::` or `0.0.0.0`)
- Accessible from your local network and potentially the internet
- **Security Risk**: External IPs can access your development server

**After** (with `--bind 127.0.0.1`):
- Server only listens on localhost (`127.0.0.1`)
- Only accessible from your own computer
- **Secure**: External IPs cannot access your server

---

## 📋 Quick Reference

### Secure Start (Localhost Only)
```powershell
python -m http.server 8000 --bind 127.0.0.1
```

### Network-Accessible Start (Use with Caution)
```powershell
python -m http.server 8000
```

### Different Port
```powershell
python -m http.server 8001 --bind 127.0.0.1
```

---

## ✅ Favicon Added

The favicon has been added to eliminate the `/favicon.ico` 404 errors:
- Created: `favicon.svg` (modern SVG favicon with "JB" initials)
- Linked in: `index.html` (line 10)

After restarting the server and refreshing your browser, you should no longer see favicon 404 errors.

---

## 🛡️ Security Notes

The 404 errors you saw from IP `10.0.0.120` were automated attacks trying to exploit:
- Router vulnerabilities (`/loginMsg.js`, `/cgi/get.cgi`)
- IoT device exploits (`/boaform/admin/formPing`)

Using `--bind 127.0.0.1` prevents these attacks by making your server inaccessible from the network.

**Never expose development servers to the internet without proper security measures.**

