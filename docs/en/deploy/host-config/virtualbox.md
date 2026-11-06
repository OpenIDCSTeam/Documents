# VirtualBox host configuration

<div class="oidc-todo">
  <span class="oidc-todo__label">Pending · written by the maintainer</span>
</div>

::: warning Same machine required
`is_remote = false`: the controller must run on the same machine as VirtualBox.
:::

| Field | Example |
|---|---|
| Name | `vbox-local` |
| Type | Oracle VirtualBox |
| Address | `localhost` |
| VBoxManage path | `C:\Program Files\Oracle\VirtualBox` |
| Image path | `D:\VBox\Images` |
| Data path | `D:\VBox\VMs` |

```bash
opidcs host add --name vbox-local --type VirtualBoxs --addr localhost
```

## Verify

- [ ] `VBoxManage list vms`
- [ ] host online
- [ ] VRDE console connects
