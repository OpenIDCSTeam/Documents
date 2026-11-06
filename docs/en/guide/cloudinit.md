# CloudInit Agent Installation

CloudInit is a lightweight in-guest agent (single Go binary) that runs **inside each virtual machine** and works with the OpenIDCS control plane.

Capabilities:

- **Status reporting**: CPU / memory / disk / GPU / network metrics
- **Command execution**: password reset, hostname change, soft shutdown / reboot, remote commands with result callback
- **Disk expansion**: automatic root partition expansion on first boot (ext4 / xfs / btrfs / APFS / NTFS)
- **Windows bootstrap**: silent activation, virtio driver installation on KVM, cleanup of leftover VMware Tools
- **Remote desktop info**: ToDesk / AnyDesk / Sunlogin address and password reported together with status
- **Auto update**: program and `tool/` assets, EdgeOne mirror first, GitHub fallback

---

## Supported platforms

| System | Architecture | Notes |
|--------|--------------|-------|
| Windows 7 SP1 / 8.1 / Server 2008 R2+ | x64 / x86 | dedicated `win78` build (Go 1.20) |
| Windows 10 / 11 / Server 2016+ | x64 / x86 / ARM64 | default build |
| Linux (systemd) | x64 / ARM64 | common distributions |
| macOS | x64 / Apple Silicon | managed by launchd |

> The guest must be able to reach the control plane port (default `1880`) and its NIC must have a gateway configured.

---

## One-line installation

The script downloads the latest build, stops the old service, replaces the binary and registers an auto-start service named `cloudinit`.

### Linux / macOS

```bash
curl -fsSL https://eo-idc.pika.net.cn/cloudinit/install.sh | sudo sh
```

Specific version:

```bash
curl -fsSL https://eo-idc.pika.net.cn/cloudinit/install.sh | sudo sh -s v0.4.7
```

GitHub fallback:

```bash
curl -fsSL https://github.com/OpenIDCSTeam/CloudInit/releases/latest/download/install.sh | sudo sh
```

### Windows

Run in an **elevated** PowerShell:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -Command "irm https://eo-idc.pika.net.cn/cloudinit/install.ps1 | iex"
```

GitHub fallback:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -Command "irm https://github.com/OpenIDCSTeam/CloudInit/releases/latest/download/install.ps1 | iex"
```

> The one-line installer is published with releases from `v0.4.7`. The Windows binary embeds native service support, so NSSM is not required.

---

## Install location and service

| Platform | Install directory | Service | Auto start |
|----------|-------------------|---------|------------|
| Windows | `C:\cloudinit` | Windows service `cloudinit` | yes (`sc query cloudinit`) |
| Linux | `/opt/cloudinit` | systemd `cloudinit` | `systemctl enable` |
| macOS | `/opt/cloudinit` | launchd `cloudinit` | `RunAtLoad` |

```
<install dir>/
├── CloudInit(.exe)
├── IDCConfig.ini       # optional
├── .version
├── logs/
└── tool/               # MASAIO.cmd, remote desktop tools (auto updated)
```

Custom directory:

```bash
curl -fsSL https://eo-idc.pika.net.cn/cloudinit/install.sh | sudo INSTALL_DIR=/data/cloudinit sh
```

```powershell
.\install.ps1 -InstallDir "D:\cloudinit"
```

---

## Upgrade and uninstall

Re-run the installation command to upgrade; `IDCConfig.ini`, `.version` and `tool/` are preserved.

**Windows**

```powershell
sc.exe stop cloudinit; sc.exe delete cloudinit
Remove-Item -Recurse -Force C:\cloudinit
```

**Linux**

```bash
sudo systemctl disable --now cloudinit
sudo rm -rf /opt/cloudinit /etc/systemd/system/cloudinit.service
sudo systemctl daemon-reload
```

**macOS**

```bash
sudo launchctl bootout system/cloudinit
sudo rm -rf /opt/cloudinit /Library/LaunchDaemons/cloudinit.plist
```

---

## Configuration

`IDCConfig.ini` in the install directory (all keys optional):

```ini
[server]
# report_interval = 60
# report_port = 1880
# report_path = /api/client/upload
# report_host = 10.0.0.2
# gateway_offset = 2

[update]
# enabled = true
# interval = 86400
# mirror_url = https://eo-idc.pika.net.cn/cloudinit

[system]
# virtio_enabled = true

[log]
# level = INFO
# retention = 7 days
```

---

## Control plane discovery

Without `report_host`, the agent:

1. derives a `/24` prefix from each NIC gateway (gateway does not need to end with `.1`);
2. tries the last known control plane address first (5s timeout);
3. probes the remaining addresses with **32 concurrent workers** (900ms timeout), stopping at the first valid response;
4. caches the address for subsequent rounds and re-discovers when it becomes unreachable;
5. logs a warning and skips the round if nothing responds.

A response is treated as the control plane only when it contains both `code` and `timestamp`, so JSON responses from firewalls or transparent proxies are ignored.

---

## Troubleshooting

Check these log lines first:

```text
[上报] 主循环已启动，间隔 60s，网卡数 2
[上报] 网卡 AA:BB:CC:DD:EE:FF | IP: 10.0.0.100 | 网关: 10.0.0.1
[上报] 状态已上报（主控 10.0.0.2）
```

- Only the first line: no gateway detected, check the NIC and routing table.
- `未找到主控`: control plane port (default `1880`) is unreachable or in another subnet.
- `上报连接失败`: firewall or control plane not listening.

For KVM guests without virtio drivers, the agent installs the driver package automatically; if the guest has no network at all, place `virtio-win-gt-x64.msi` into `tool/` beforehand.

Windows activation uses `tool/MASAIO.cmd`, which may still be downloading on first boot; the agent waits up to 10 minutes before running it.
