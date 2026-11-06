# MuMu host configuration

<div class="oidc-todo">
  <span class="oidc-todo__label">Pending · written by the maintainer</span>
</div>

::: warning Same machine required
`is_remote = false`: the controller must run on the same Windows host as MuMu.
:::

| Field | Example |
|---|---|
| Name | `mumu-01` |
| Type | MEmu Game Emulator |
| Address | `localhost` |
| Program path | `...\MuMuPlayer-12.0\shell` |

Options: `graphics_render_mode` (`1` DirectX / `0` OpenGL), `enable_su`, `enable_audio`, `fps`.

```bash
opidcs host add --name mumu-01 --type MemuAndroid --addr localhost
opidcs plat credentials show memu
```

## Verify

- [ ] `memuc listvms`
- [ ] host online
- [ ] ADB address connects
