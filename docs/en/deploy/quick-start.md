# Quick start

Goal: one Linux host, ten minutes, first container running.

## 1. Install the controller

```bash
curl -fsSL https://raw.githubusercontent.com/OpenIDCSTeam/CloudHost/main/install.sh | sudo bash -- --firewall
```

The script prints the URL and the Bearer token.

## 2. Log in

Open `http://<ip>:1881` with `admin` / the token, then reset the token and change the password.

## 3. Install Docker

```bash
curl -fsSL https://get.docker.com | sudo sh
sudo systemctl enable --now docker
sudo docker version
```

If Docker runs on the same host, use `localhost` as the host address.

## 4. Add a host

| Field | Value |
|---|---|
| Name | `local` |
| Type | Docker Runtime Env |
| Address | `localhost` |
| Image path | `/data/images` |
| Data path | `/data/vms` |

## 5. Create an instance

Choose host `local`, an image, 1 CPU / 1 GB / 10 GB, submit, wait for the task.

## 6. Open the console

Instance detail → Console. Containers use the web terminal; virtual machines use noVNC.

## Troubleshooting

| Symptom | Fix |
|---|---|
| Host offline | check SSH, credentials, docker group |
| No images | check `images_path` and file names |
| Create failed | open task detail for the platform error |
| Console 404 | ensure `static/` and `VNCConsole/` exist |
