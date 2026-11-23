# MEmu host configuration

<div class="oidc-todo">
  <span class="oidc-todo__label">Pending · written by the maintainer</span>
</div>

::: warning Same machine required
`is_remote = false`: the controller must run on the same Windows host as MEmu.
:::

| Field | Example |
|---|---|
| Name | `memu-01` |
| Type | MEmu Game Emulator |
| Address | `localhost` |
| Program path | `%APPDATA%\Microvirt\MEmu` |

Options: `graphics_render_mode` (`1` DirectX / `0` OpenGL), `enable_su`, `enable_audio`, `fps`.

```bash
quickidc host add --name memu-01 --type MemuAndroid --addr localhost
quickidc plat credentials show memu
```

## Verify

- [ ] `memuc listvms`
- [ ] host online
- [ ] ADB address connects
