---
title: Quick Start
---

# Quick Start

This guide gets OpenIDCS running on your machine in **5 minutes**.

## Prerequisites

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| OS | Windows 10 / Ubuntu 18.04 / CentOS 7 / macOS 10.14 | Windows Server 2019 / Ubuntu 22.04 / macOS 13 |
| Python | 3.8 | 3.10 or 3.11 |
| RAM | 4 GB | 8 GB+ |
| Disk | 2 GB free | 10 GB+ |

Open ports: **1880** (Web UI), **6080** (VNC proxy), **7681** (Web terminal).

## Install

### Windows

```batch
git clone https://github.com/OpenIDCSTeam/OpenIDCS-Client.git
cd OpenIDCS-Client
pip install -r HostConfig/pipinstall.txt
python MainServer.py
```

### Linux (Debian / Ubuntu)

```bash
sudo apt update
sudo apt install -y python3 python3-venv git
git clone https://github.com/OpenIDCSTeam/OpenIDCS-Client.git
cd OpenIDCS-Client
python3 -m venv venv && source venv/bin/activate
pip install -r HostConfig/pipinstall.txt
python MainServer.py
```

### Linux (CentOS / RHEL / Rocky)

```bash
sudo yum install -y python3 git gcc python3-devel
git clone https://github.com/OpenIDCSTeam/OpenIDCS-Client.git
cd OpenIDCS-Client
python3 -m venv venv && source venv/bin/activate
pip install -r HostConfig/pipinstall.txt
python MainServer.py
```

### macOS

```bash
brew install python@3.11 git
git clone https://github.com/OpenIDCSTeam/OpenIDCS-Client.git
cd OpenIDCS-Client
python3 -m venv venv && source venv/bin/activate
pip install -r HostConfig/pipinstall.txt
python MainServer.py
```

## First Login

1. Open [http://localhost:1880](http://localhost:1880).
2. On first launch the controller prints an access **Token** in the console:

   ```
   ========================================
   OpenIDCS Server Started
   Token: abc123def456...
   Web:   http://localhost:1880
   ========================================
   ```

3. Paste the token in the login page, or create an admin account immediately under **Users → Add User**.

## Add Your First Host

Open **Hosts → Add Host**. Pick the right type, fill in the form, hit **Test Connection**, then **Save**.

### VMware Workstation

| Field | Value |
|-------|-------|
| Type | `VmwareWork` |
| Address / Port | your-server-ip : 8697 |
| User / Password | vmrest credentials |
| VM path | `C:\Virtual Machines\` |

### Docker

| Field | Value |
|-------|-------|
| Type | `Docker` |
| Address / Port | your-server-ip : 2376 |
| Cert path | `/path/to/client-certs` |
| Public / NAT bridge | `docker-pub` / `docker-nat` |

### LXD

| Field | Value |
|-------|-------|
| Type | `LXD` |
| Address / Port | your-server-ip : 8443 |
| Cert path | `/path/to/lxd-certs` |
| Public / NAT bridge | `br-pub` / `br-nat` |

::: tip
Need help setting up the remote host? See [Client Setup](/en/config/client) and each platform's own page under [Virtualization Platforms](/en/vm/comparison).
:::

## Create Your First VM

1. Go to **VMs → Create VM**.
2. Fill in:
   - Name: `test-vm-01`
   - Host: pick from the list
   - OS template / image
   - CPU / RAM / disk
   - Network: NAT (auto IP) or Public (from pool)
3. Click **Create**.
4. When the VM is ready, click **Start**, then open the **Console** tab for a browser-based VNC session.

## Expose a Service

**NAT port forwarding** — expose port 80 of a VM on the host:

1. VM detail page → **Network → Add Port Forward**.
2. Host port `8080`, VM port `80`, protocol `TCP`.
3. Save. Now `http://host:8080` reaches the VM.

**HTTP reverse proxy** — bind a domain:

1. **Web Proxy → Add Rule**.
2. Domain `app.example.com`, target `10.0.0.5:80`, enable SSL.
3. Save. HTTPS certificate is issued automatically.

## Add Users & Quotas

1. **Users → Add User** — pick a role and set quotas (CPU, RAM, storage, VM count).
2. Check or uncheck fine-grained permissions (create / delete / power / console / network).
3. Hand over credentials; the new user logs in at the same URL.

## Where to Go Next

- 🛠️ [Installation](/en/guide/installation) — production deployment (systemd, Docker, Nginx + SSL).
- 🧩 [Features](/en/guide/features) — everything OpenIDCS can do.
- 📊 [Platform Comparison](/en/vm/comparison) — choose the right hypervisor.
- 🎯 [Tutorials](/en/tutorials/vm-management) — in-depth walk-throughs.

## Troubleshooting

<details><summary>Port 1880 already in use</summary>

```bash
# Linux / macOS
lsof -i :1880
# Windows
netstat -ano | findstr 1880
```

Change the port in `DataSaving/settings.json` or via `HOST_SERVER_PORT=1881 python MainServer.py`.

</details>

<details><summary>Host test-connection fails</summary>

1. Confirm the controlled host has the platform service running.
2. Confirm the port is open in the host's firewall.
3. Check TLS certificates, usernames and passwords.
4. Tail `DataSaving/log-main.log`.

</details>

<details><summary>VM stuck in "creating"</summary>

1. Check host free CPU / RAM / disk.
2. Check the user's remaining quota.
3. Confirm the OS template exists on the host.
4. Tail the log again.

</details>
