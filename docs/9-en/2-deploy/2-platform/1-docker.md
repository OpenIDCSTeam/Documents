# Docker / Podman deployment

The controller manages containers by running the `docker` CLI locally or over SSH — no Docker TCP port is required.

## Install

```bash
# Linux one-liner
curl -fsSL https://get.docker.com | sudo sh
sudo systemctl enable --now docker

# Debian / Ubuntu
sudo apt install -y docker.io

# RHEL family
sudo dnf install -y docker
```

```bash
# permissions
sudo usermod -aG docker $USER
newgrp docker
docker ps
```

::: tip
Membership in the `docker` group is equivalent to root. Use a dedicated account and restrict source IPs.
:::

## Add the host

| Field | Example |
|---|---|
| Name | `docker-01` |
| Type | Docker Runtime Env (`OCInterface`) |
| Address | `10.0.0.51` or `localhost` |
| User / Password | SSH credentials |
| Image path | `/data/images` |
| Data path | `/data/vms` |

```bash
opidcs plat install docker
opidcs host add --name docker-01 --type OCInterface --addr 10.0.0.51 --user root
opidcs host status docker-01
```

## Limits

| Item | Support |
|---|---|
| GPU / VRAM | no |
| PCI / USB | no |
| ISO | no |
| Extra disk | no |
| Bandwidth cap | no |
| Console | web terminal / logs |

## Images

```bash
docker pull debian:12
docker import debian-rootfs.tar debian12
```

## Troubleshooting

| Symptom | Fix |
|---|---|
| Host offline | check SSH and port |
| permission denied | add user to `docker` group |
| Image pull fails | configure a registry mirror |
