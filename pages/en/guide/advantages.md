---
title: Core Advantages
---

# Core Advantages

OpenIDCS is not another hypervisor. It is the **control plane** that sits on top of your existing hypervisors. Here is what makes it worth adopting.

## 1. One Console, Every Platform

Most teams end up using three, four or five different tools to run a production IDC:

- vSphere Client / ESXi host UI
- VMware Workstation Pro
- Proxmox VE Web UI
- Windows Admin Center / Hyper-V Manager
- `docker` / `podman` CLI + Portainer
- `lxc` CLI
- Vendor cloud portals (Qingzhou, etc.)

OpenIDCS replaces all of them with **one** browser tab. The UI, the URL scheme, the keyboard shortcuts and the API are identical regardless of what is running underneath.

## 2. API-First Design

Every single thing you can do in the UI is also a documented REST endpoint:

```bash
curl -X POST https://openidcs.example.com/api/vms \
  -H "X-Auth-Token: $TOKEN" \
  -d '{"host":"pve-01","cpu":4,"mem":8192,"disk":80,"os":"ubuntu-22.04"}'
```

That unlocks:

- **Billing integration** — ready-made plugins for ZJMF (魔方财务), IDCSmart and SwapIDC.
- **CI/CD** — spin up isolated test VMs from pipelines.
- **Infrastructure as code** — write your own Terraform / Ansible modules.
- **ChatOps / AI agents** — operate your fleet from a chat window.

## 3. Real Multi-Tenant Isolation

Built-in RBAC, not an afterthought:

- **Roles**: admin, operator, read-only, custom.
- **Fine-grained permissions**: create / edit / delete / power / console / network / quota — per resource type.
- **Hard quotas**: CPU cores, RAM, storage, monthly bandwidth, simultaneous VMs.
- **Ownership model**: every VM has a user, every action is audited.

Perfect for labs, schools, managed hosting and internal shared platforms.

## 4. Batteries-Included Networking

Networking is the hardest part of any homegrown platform. OpenIDCS ships:

- **IP pool management** — public & private pools, automatic allocation with collision detection.
- **NAT port forwarding** — per-VM TCP/UDP rules applied via iptables/nftables or native APIs.
- **HTTP reverse proxy** — domain → VM:port with Let's Encrypt SSL.
- **Firewall rules** — generate iptables/nftables per VM.
- **Web SSH / VNC** — no client needed, no open ports to the VM itself.

## 5. Light on Resources

OpenIDCS itself is a single Python + SQLite process. It runs happily on a 1-core / 2 GB VM while managing hundreds of guests.

- No Kubernetes required.
- No external database required (SQLite is the default, any SQL backend can be plugged in).
- No message broker required.
- Works behind Nginx / Caddy with standard reverse proxying.

## 6. Cross-Platform End to End

| Component | Windows | Linux | macOS |
|-----------|:-------:|:-----:|:-----:|
| Controller (main server) | ✅ | ✅ | ✅ |
| VMware Workstation agent | ✅ | ✅ | ❌ |
| LXD agent | ❌ | ✅ | ❌ |
| Docker agent | ✅ | ✅ | ✅ |
| Hyper-V agent | ✅ | ❌ | ❌ |
| Proxmox / ESXi agent | ✅ | ✅ | ✅ |

You can mix any combination. A Windows controller managing Linux Proxmox hosts and Windows VMware hosts works out of the box.

## 7. Observability Without a Stack

- Per-host & per-VM CPU / RAM / disk / network charts (ECharts).
- Full audit log of user actions and API calls.
- Scheduled tasks (backup, cleanup, report) in the UI.
- Optional Webhook / email / SMS alerting on quota breach, offline hosts, failed operations.

## 8. Dark Mode, i18n, Themes

- Built-in **dark / light mode toggle**.
- **Chinese & English** for both the console and this docs site.
- Pluggable **themes** (default, transparent, custom).
- Fully responsive — works on laptops, 4K monitors and tablets.

## 9. 100% Open Source, Forever

- **AGPLv3** — no license fees, no feature gates.
- Hosted on GitHub, all commits public, all issues public.
- Community plugins for billing systems, themes, languages and hypervisor drivers.

## 10. Production-Proven

OpenIDCS is already used by:

- IDC service providers offering VPS plans.
- Schools running teaching labs with hundreds of student VMs.
- R&D teams that need a self-service VM pool.
- Small SaaS operators hosting per-tenant workloads.

## See It in Action

- 🚀 [Quick Start](/en/guide/quick-start) — stand up a demo in 5 minutes.
- 🛠️ [Installation](/en/guide/installation) — production deployment guide.
- 🧩 [Features](/en/guide/features) — the full feature catalogue.
- 📊 [Platform Comparison](/en/vm/comparison) — pick the right hypervisor.
