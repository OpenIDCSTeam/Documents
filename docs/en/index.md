---
layout: home

hero:
  name: OpenIDCS
  text: Unified Virtualization Management
  tagline: Manage VMware, Proxmox, Hyper-V, ESXi, LXD, Docker and more from a single Web UI and RESTful API.
  image:
    src: /logo.svg
    alt: OpenIDCS
  actions:
    - theme: brand
      text: Quick Start
      link: /en/guide/quick-start
    - theme: alt
      text: View on GitHub
      link: https://github.com/OpenIDCSTeam/OpenIDCS-Client
    - theme: alt
      text: 中文文档
      link: /

features:
  - icon: 🧩
    title: Multi-Platform, One UI
    details: One console for VMware Workstation / vSphere ESXi, Proxmox VE, Windows Hyper-V, LXC/LXD, Docker/Podman and Qingzhou Cloud.
  - icon: 🔌
    title: Complete REST API
    details: Every feature exposed through token-authenticated REST endpoints, ready for automation, CI/CD and third-party billing systems.
  - icon: 🖥️
    title: Full VM Lifecycle
    details: Create, clone, snapshot, migrate, resize and destroy VMs across every supported platform with a consistent workflow.
  - icon: 🌐
    title: Networking & Proxy
    details: IP pool management, NAT port forwarding, HTTP reverse proxy with SSL, iptables firewall rules and Web SSH terminal.
  - icon: 👥
    title: Multi-Tenant RBAC
    details: Role-based access control, fine-grained permissions and hard per-user quotas on CPU, memory, storage, bandwidth and VM count.
  - icon: 📊
    title: Monitoring & Audit
    details: Real-time host & VM metrics, ECharts dashboards, complete audit logs and scheduled tasks for backup and cleanup.
  - icon: 🔐
    title: Web VNC Console
    details: Browser-based VNC console with SSL encryption — no client installation, no plugins, instant remote desktop.
  - icon: 🌙
    title: Dark Mode & i18n
    details: Built-in dark / light appearance switch and full Chinese / English interface for both the console and this documentation.
  - icon: 📦
    title: 100% Open Source
    details: Released under AGPLv3. Self-host on Windows, Linux or macOS. No vendor lock-in, no license fees.
---

## Why OpenIDCS

OpenIDCS (Open Internet Data Center System) is an open-source unified management platform that lets you operate heterogeneous virtualization infrastructure the same way you would a single cloud.

- 🏢 **Small & medium IT teams** — unify dev, test and prod VMs in one console.
- ☁️ **Private cloud operators** — a lightweight front-end for your private cloud.
- 🎓 **Labs & training** — share VM resources across classrooms and workshops.
- 🏭 **IDC providers** — bring your legacy IDC online with billing integration.

## Supported Platforms

| Platform | Status | OS | Architecture |
|----------|:------:|-----|--------------|
| LXC / LXD | ✅ GA | Linux | x86_64 / ARM64 |
| Docker / Podman / Kubernetes | ✅ GA | Windows / Linux / macOS | x86_64 / ARM64 |
| VMware Workstation | ✅ GA | Windows | x86_64 |
| VMware vSphere ESXi | ✅ GA | — | x86_64 |
| Proxmox VE / QEMU | ✅ GA | Linux | x86_64 / ARM64 |
| Windows Hyper-V | ✅ GA | Windows Server | x86_64 |
| Qingzhou Cloud | ✅ GA | — | — |
| Oracle VirtualBox | 🚧 WIP | Windows / Linux | x86_64 / ARM64 |
| QEMU / KVM | 🚧 WIP | Linux | x86_64 / ARM64 |

## Get Started in 5 Minutes

```bash
git clone https://github.com/OpenIDCSTeam/OpenIDCS-Client.git
cd OpenIDCS-Client
pip install -r HostConfig/pipinstall.txt
python MainServer.py
```

Open [http://localhost:1880](http://localhost:1880) and sign in with the token printed in the console.

→ Continue with [Quick Start](/en/guide/quick-start) · [Installation](/en/guide/installation) · [Architecture](/en/guide/features)
