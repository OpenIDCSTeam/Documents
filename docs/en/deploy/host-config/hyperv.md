# Hyper-V host configuration

<div class="oidc-todo">
  <span class="oidc-todo__label">Pending · written by the maintainer</span>
</div>

Prerequisite: [Hyper-V enabled](/en/deploy/platform/hyperv), WinRM `5985` reachable.

| Field | Example |
|---|---|
| Name | `win-hv` |
| Type | Windows HyperV x64 |
| Address | `10.0.0.44:5985` |
| User | `Administrator` |
| Image path | `D:\HyperV\Images` |
| Disk path | `D:\HyperV\VHD` |
| Backup path | `D:\HyperV\Backup` |
| Instance cap | `40` |

```bash
opidcs host add --name win-hv --type HyperVSetup --addr 10.0.0.44:5985 --user Administrator
opidcs host status win-hv
```

## Verify

- [ ] `Get-VM` works
- [ ] host online
- [ ] console (noVNC/RDP) opens
- [ ] power and delete succeed
