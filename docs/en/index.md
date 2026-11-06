---
layout: home

hero:
  name: OpenIDCS
  text: One console for every hypervisor
  tagline: A single Go binary that manages Docker, LXD, Proxmox VE, ESXi, Hyper-V, QEMU, VirtualBox and SmolVM — with a browser console, REST API, CLI and billing plugins.
  image:
    src: /logo.svg
    alt: OpenIDCS
  actions:
    - theme: brand
      text: Install in one line
      link: /en/deploy/core-install
    - theme: alt
      text: Quick start
      link: /en/deploy/quick-start
    - theme: alt
      text: 中文文档
      link: /

features:
  - title: Multi-platform, one model
    details: Ten engine types share one host and instance model. Platform limits are declared in metadata, not guessed by the UI.
  - title: Complete REST API
    details: The console, opidcs CLI, billing plugins and your scripts all call the same /api resources.
  - title: Instance lifecycle
    details: Create, power, reinstall, back up, restore and delete with async tasks, progress and retry.
  - title: Built-in networking
    details: NAT port forwarding, iKuai DHCP/ARP binding, Caddy reverse proxy with TLS, VNC and Web SSH proxies.
  - title: Multi-tenant
    details: Users, quotas, ownership, sharing and 16-character access keys — no separate RBAC engine required.
  - title: Built for selling
    details: IDCSmart, LxdServer, SwapIDC, EasyPanel and VistaPanel plugins ship with the controller.
  - title: Observable
    details: Task timelines, file and database logs, outbox and tombstone reconciliation, maintenance jobs.
  - title: AGPLv3
    details: Controller, console, agent and plugins are fully open source.
---

## Why OpenIDCS

OpenIDCS turns heterogeneous virtualization into one sellable platform:

- **Self-hosted IDC / cloud resellers** — manage several hypervisors and one billing system.
- **Private cloud teams** — one panel for test, staging and production machines.
- **Developers** — a clear Go controller + React console + REST API as a base.

## Supported platforms

| Platform | Access | Status |
|---|---|---|
| Docker / Podman | local or SSH | GA |
| LXC / LXD | local or SSH | GA |
| Proxmox VE | API 8006 | GA |
| VMware ESXi | API 443 | GA |
| Hyper-V | WinRM 5985 | GA |
| QEMU / KVM | local or SSH | GA |
| VirtualBox | local only | GA |
| VMware Workstation | vmrest 8697 | GA (Windows host) |
| SmolVM | local or SSH | experimental |
| MuMu emulator | local only | GA (Windows host) |
| Qingzhou Cloud | API | disabled |

## Start here

→ [Install CloudHost](/en/deploy/core-install) · [Quick start](/en/deploy/quick-start) · [Platforms](/en/deploy/platform/) · [Billing](/en/deploy/finance/)
