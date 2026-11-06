# Console & remote access

OpenIDCS brings "connect to the machine" into the browser.

## Three channels

| Channel | Platforms | Port | Entry |
|---|---|---|---|
| noVNC | LXD, Proxmox, ESXi, Hyper-V, QEMU, VirtualBox (VRDE), Workstation, Qingzhou | controller `6080` | Instance detail → Console |
| Web SSH | Linux-based platforms | controller `7681` | Instance detail → Terminal |
| RDP / ADB | Hyper-V, Workstation, MuMu | platform side | Instance detail → Remote info |

::: info Global proxies
`6080` and `7681` are services inside the controller, not per-instance agents. Platform differences only affect how the VNC endpoint or shell is obtained.
:::

## VNC flow

1. The console requests `GET /api/client/remote/:hs_name/:vm_uuid`.
2. The driver fetches the VNC endpoint and ticket (Proxmox `vncwebsocket`, ESXi ticket, LXD console).
3. The controller issues a one-time token bound to the client IP.
4. The browser opens `VNCConsole/vnc.html?token=...` and connects to `6080/websockify`.
5. The controller validates the token and relays traffic.

Security: short-lived token, IP binding, optional `wss`, local noVNC assets (no CDN).

## Web SSH

- Built-in terminal server on `7681`.
- SSH host keys are trusted on first use and persisted; changes raise a warning.
- Credentials come from temporary tokens or access keys, not stored plaintext.

## Temporary tokens vs access keys

| Type | Lifetime | API | Use |
|---|---|---|---|
| Temporary token | short | `GET /api/client/temptoken/:hs/:uuid` | one-time console login |
| Access key | long (16 chars) | `POST /api/client/access-key/:hs/:uuid` | user self-service login |

Access key login uses `/api/client/keylogin` and grants the same capabilities as a temporary token.

## RDP and Android

- Hyper-V / Workstation return RDP endpoints and credentials.
- MuMu returns an ADB address for `adb connect`.

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Black screen | VNC port unreachable | check firewall and `remote_port` |
| Token expired | TTL or IP change | reopen the console |
| SSH refused | sshd not running | log in via VNC and check |
| Host key changed | instance reinstalled | confirm and update fingerprint |
