# Worker Node Configuration

A worker node is a server that runs a virtualization platform. OpenIDCS connects to worker nodes over the network to manage VMs. This document covers how to prepare each supported worker type.

## Quick Overview

| Platform | Default Port | Auth Method | Auto-install Script |
|----------|--------------|-------------|---------------------|
| Docker / Podman | 2376 | TLS certificates | `HostConfig/setups-oci.sh` |
| LXC / LXD | 8443 | TLS certificates | `HostConfig/setups-lxd.sh` |
| VMware Workstation | 8697 | Basic auth | `HostConfig/setups-vmw.ps1` |
| Proxmox VE | 8006 | Token / password | Use Proxmox Web UI |
| VMware ESXi | 443 | Username / password | Enable in ESXi Web UI |
| Windows Hyper-V | 5985 / 5986 | WinRM Basic / Kerberos | `HostConfig/setups-hyv.ps1` |
| Qingzhou | 443 | API Key | Apply via the Qingzhou console |

> 📖 For deeper, platform-specific documentation, see the dedicated pages under **VM Platforms**.

## Docker / Podman Worker

### Auto Install

```bash
scp HostConfig/setups-oci.sh user@your-server:/tmp/
ssh user@your-server "cd /tmp && sudo bash setups-oci.sh"
```

The script:

- Detects the distribution (Ubuntu / Debian / CentOS / RHEL / Rocky / Alma / Fedora / Arch).
- Installs Docker or Podman.
- Generates TLS certificates.
- Creates `docker-pub` / `docker-nat` bridges.
- Opens the firewall.
- Installs `ttyd` for the web terminal.

### Supported Distributions

| Distro | Versions | Package Manager |
|--------|----------|-----------------|
| Ubuntu | 18.04+ | apt |
| Debian | 10+ | apt |
| CentOS | 7 / 8 | yum / dnf |
| RHEL | 7 / 8 / 9 | yum / dnf |
| Rocky Linux | 8 / 9 | dnf |
| AlmaLinux | 8 / 9 | dnf |
| Fedora | 36+ | dnf |
| Arch Linux | Latest | pacman |

### Manual Steps

1. **Install Docker** via the official repository for your distribution.
2. **Generate TLS certs** under `/etc/docker/certs` (CA + server + client).
3. **Configure `/etc/docker/daemon.json`**:

   ```json
   {
     "hosts": ["unix:///var/run/docker.sock", "tcp://0.0.0.0:2376"],
     "tls": true,
     "tlsverify": true,
     "tlscacert": "/etc/docker/certs/ca.pem",
     "tlscert": "/etc/docker/certs/server-cert.pem",
     "tlskey": "/etc/docker/certs/server-key.pem"
   }
   ```

4. **Restart Docker** and create bridges:

   ```bash
   sudo docker network create --driver bridge docker-pub
   sudo docker network create --driver bridge docker-nat
   ```

5. **Open port 2376** in the firewall.
6. **Copy `ca.pem`, `client-cert.pem`, `client-key.pem`** to the master node.

## LXC / LXD Worker

### Auto Install

```bash
scp HostConfig/setups-lxd.sh user@your-server:/tmp/
ssh user@your-server "cd /tmp && sudo bash setups-lxd.sh"
```

### Manual Steps

```bash
# 1. Install LXD (snap recommended for latest)
sudo snap install lxd

# 2. Initialize
sudo lxd init     # answer 'yes' to remote access, set trust password

# 3. Remote endpoint
sudo lxc config set core.https_address "[::]:8443"

# 4. Create bridges
sudo lxc network create br-pub  ipv4.address=none ipv4.nat=false
sudo lxc network create br-nat  ipv4.address=10.0.0.1/24 ipv4.nat=true

# 5. Firewall
sudo ufw allow 8443/tcp
```

Copy `client.crt` / `client.key` from `/var/snap/lxd/common/config/` (snap) or `/var/lib/lxd/` (apt) to the master node.

## VMware Workstation Worker

### Enable the REST API

**Windows:**

```batch
"C:\Program Files (x86)\VMware\VMware Workstation\vmrest.exe"

:: As a service
sc create VMwareRESTAPI binPath= "C:\Program Files (x86)\VMware\VMware Workstation\vmrest.exe" start= auto
sc start VMwareRESTAPI
```

**Linux:**

```bash
sudo systemctl enable vmrest
sudo systemctl start vmrest
```

On first launch `vmrest` will prompt you to set a username and password. Then open TCP **8697** in the firewall.

Test:

```bash
curl -k -u "admin:password" https://localhost:8697/api/vms
```

## Proxmox VE Worker

No extra installation is required — OpenIDCS talks directly to the built-in Proxmox API on port **8006**.

1. In the Proxmox Web UI go to **Datacenter → Permissions → API Tokens**.
2. Create a token for user `root@pam` (or a dedicated user) with the required role.
3. Provide the API token to OpenIDCS when adding the host.

For deeper setup (cluster, ZFS, firewall), see the [Proxmox VE platform page](/en/vm/proxmox).

## VMware ESXi Worker

1. Log in to the ESXi Web Client.
2. **Host → Manage → Services**: start `TSM-SSH` (optional) and make sure `hostd` is running.
3. Allow management traffic to TCP **443**.
4. Use `root` (or another admin account) when adding the host to OpenIDCS.

More details on the [ESXi platform page](/en/vm/esxi).

## Windows Hyper-V Worker

1. Install the Hyper-V role:

   ```powershell
   Install-WindowsFeature -Name Hyper-V -IncludeManagementTools -Restart
   ```

2. Enable WinRM:

   ```powershell
   Enable-PSRemoting -Force
   winrm quickconfig
   Set-Item WSMan:\localhost\Service\Auth\Basic $true
   Set-Item WSMan:\localhost\Service\AllowUnencrypted $false
   ```

3. Issue a certificate and start the HTTPS listener on port **5986**.
4. Open the firewall for TCP **5986**.

More details on the [Hyper-V platform page](/en/vm/hyperv).

## Qingzhou Cloud Worker

Qingzhou is managed via the vendor API. Apply for an API Key in the Qingzhou console, then add it to OpenIDCS. No local agent is required on the worker side.

## Verifying Worker Connectivity

### Docker

```bash
docker --tlsverify \
  --tlscacert=./certs/ca.pem \
  --tlscert=./certs/client-cert.pem \
  --tlskey=./certs/client-key.pem \
  -H=tcp://your-server:2376 ps
```

### LXD

```bash
lxc remote add myserver https://your-server:8443
lxc list myserver:
```

### VMware Workstation

```bash
curl -k https://your-server:8697/api/vms
```

## Troubleshooting

### Docker connection refused

```bash
sudo systemctl status docker
sudo netstat -tlnp | grep 2376
sudo journalctl -u docker -n 50
```

### LXD certificate error

```bash
sudo lxd init --auto
sudo lxc config trust add client.crt
```

### VMware REST API not responding

```batch
sc query VMwareRESTAPI
sc stop VMwareRESTAPI && sc start VMwareRESTAPI
```

## Security Recommendations

- Rotate TLS certificates periodically (default validity: 365 days).
- Restrict firewall rules to the master-node IP only.
- Never use `root` for routine operations — create dedicated service accounts.
- Enable IP whitelists on the master-node `.env` when the attack surface is small.

## Next Steps

- ⚙️ Configure the [master node](/en/config/server).
- 🐳 Read the [Docker platform guide](/en/vm/docker).
- 📦 Read the [LXD platform guide](/en/vm/lxd).
- 🖥️ Read the [VMware platform guide](/en/vm/vmware).
