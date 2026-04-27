---
title: Features
---

# Features

A tour of everything OpenIDCS gives you out of the box.

## 🖥️ Full VM Lifecycle

Consistent operations across every supported hypervisor:

| Operation | Docker | LXD | VMware | ESXi | Proxmox | Hyper-V | Qingzhou |
|-----------|:------:|:---:|:------:|:----:|:-------:|:-------:|:--------:|
| Create / delete | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Power on / off / reboot | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Reset root password | ✅ * | ✅ * | ✅ | ✅ | ✅ | ✅ | ✅ |
| Screenshot | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Snapshot / backup | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Restore / rollback | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Resize CPU / RAM | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Resize / add disk | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Mount ISO | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Disk migration | — | — | ✅ | — | ✅ | — | — |
| PCI / USB passthrough | — | — | ✅ | ✅ | ✅ | ✅ (PCI) | — |
| Clone / template | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

<small>* via external agent (cloud-init / QEMU guest agent)</small>

## 🌐 Networking

- **IP pool management** — public + private pools, auto-allocation, reservation, history.
- **NAT port forwarding** — per-VM TCP/UDP rules through iptables/nftables or native APIs.
- **HTTP reverse proxy** — domain ↔ VM:port, per-host Nginx config, Let's Encrypt.
- **Firewall rules** — generate iptables/nftables per VM, blacklists / whitelists.
- **Bandwidth limits** — ingress / egress caps per VM.
- **Multi-NIC VMs** — add extra interfaces with automatic IP provisioning.

## 👥 Users, Roles & Quotas

- **Built-in roles**: admin, operator, read-only, custom.
- **Fine-grained permissions**: create, edit, delete, power, console, network, quota-edit — per resource type.
- **Per-user hard quotas**: CPU cores, RAM, storage, monthly bandwidth, max simultaneous VMs.
- **Ownership**: every VM has an owner, every action is audited.
- **Self-service** registration can be enabled / disabled.
- **Token + session auth**; optional IP whitelist and rate limiting.

## 📊 Monitoring & Observability

- Real-time host & VM CPU / RAM / disk / network charts (ECharts).
- Per-host and per-fleet dashboards.
- Complete audit log of user actions and API calls.
- Per-operation status with progress.
- Scheduled tasks (backup, cleanup, report).
- Optional Webhook / email / SMS alerting.

## 🔌 Remote Access

- **Browser-based VNC console** (Websockify + noVNC) — no plugin, no client.
- **Web SSH / terminal** (ttyd) for Linux guests.
- **RDP helper** for Windows guests.
- All encrypted with TLS, optional IP whitelist.

## 💾 Storage

- Virtual disk management — create / attach / detach / resize / migrate.
- ISO image library per host.
- Snapshot / backup / restore per VM, scheduled or on-demand.
- Compressed exports for off-site storage.

## 🧰 API & Integrations

- Full RESTful API, Token & Session auth.
- OpenAPI / Swagger spec.
- Ready-made plugins for:
  - **ZJMF (魔方财务)** — Chinese billing SaaS.
  - **IDCSmart** — Chinese billing SaaS.
  - **SwapIDC** — Chinese billing SaaS.
  - Generic webhook receiver.
- Python SDK and copy-paste cURL examples.

## 🌍 i18n & Themes

- **Chinese** and **English** for both the console and this docs site.
- **Dark / light mode** toggle.
- Built-in themes: default, transparent, dark-neon — or build your own.

## 🧱 Architecture Highlights

- Single-process Python backend, SQLite by default.
- Pluggable hypervisor drivers (add your own in <300 LoC).
- React 18 + TypeScript + Vite front-end, Ant Design 5 + TailwindCSS.
- Optional Nuitka / cx_Freeze builds for frozen binaries.

## 🔒 Security

- TLS everywhere (controller ↔ agent, browser ↔ controller).
- Rolling audit log.
- Credential storage with fernet encryption.
- Configurable session timeout, login attempt limits, 2FA-ready.
- No anonymous endpoints except `/healthz`.

## 📦 Packaging

- Ships as:
  - Python source (run from Git).
  - Single-file **Nuitka** binary (recommended).
  - **cx_Freeze** bundle.
  - **Docker image** for containerized deployment.
  - **systemd service** files for Linux.
  - **NSSM** service for Windows.

## Roadmap Highlights

- Oracle VirtualBox driver
- Standalone QEMU / KVM driver
- Memu Android emulator driver
- Cluster-aware scheduler
- Built-in object storage for images
- Grafana-compatible metrics exporter

→ Continue with [Quick Start](/en/guide/quick-start) or [Installation](/en/guide/installation).
