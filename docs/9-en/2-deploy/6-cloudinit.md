# CloudInit Agent (in-guest)

The `OpenIDCSTeam/CloudInit` agent runs **inside managed instances** and works with the controller to:

- report IP / MAC / hostname;
- receive password and command instructions;
- self-update;
- install virtio drivers on Windows images.

::: info Not the same as cloud-init
`cloud-init` is the distribution's first-boot initializer. The **CloudInit Agent** is OpenIDCS's own daemon.
:::

## Install

Download from [CloudInit Releases](https://github.com/OpenIDCSTeam/CloudInit/releases):

```bash
# Linux
sudo ./cloudinit install
sudo systemctl enable --now cloudinit

# Windows (admin)
.\cloudinit.exe install
```

## Configuration (`IDCConfig.ini`)

```ini
[server]
report_interval = 60
# Controller default is 1881; the agent default is 1880
report_port = 1881
report_path = /api/client/upload
report_host =
gateway_offset = 2

[update]
enabled = true
interval = 86400
repo_url = https://api.github.com/repos/OpenIDCSTeam/CloudInit/releases/latest
mirror_url = https://eo-idc.pika.net.cn/cloudinit

[system]
virtio_enabled = true

[log]
level = INFO
retention = 7 days
```

::: danger Most common pitfall
The agent defaults to `1880` (legacy Python controller), while the Go controller listens on `1881`. If instance IPs never appear, check this first.
:::

## Reporting

1. Read `report_host`; if empty, use the default gateway and probe `.2` onwards.
2. POST instance info to `/api/client/upload`.
3. The controller matches the record by MAC / instance id and updates the IP.

## Commands

Commands are queued by the controller and fetched on the next heartbeat; results are posted to `/api/client/cmd_result`. Password changes need the agent online (or `qemu-guest-agent` for QEMU).

## Verify

```bash
systemctl status cloudinit
tail -f /var/log/cloudinit.log
```

The instance IP should appear within one or two reporting intervals.
