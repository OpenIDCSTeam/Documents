# Settings

<div class="oidc-todo">
  <span class="oidc-todo__label">Pending · written by the maintainer</span>
  <p>Settings affect security and runtime behavior. The full walkthrough and screenshots will be added by the project owner.</p>
</div>

## Groups

| Group | Content |
|---|---|
| Basic | site name, logo, language, registration |
| Network | controller port, public URL, VNC/SSH ports |
| Token | view / set / reset Bearer token |
| Admin | reset admin password |
| Mail | SMTP server, sender, test |
| Security | login limits, Turnstile |
| Logs | retention and levels |
| Quota | global defaults |
| Theme | default theme preset |
| Update | version and update check |

<figure class="oidc-figure">
  <img src="/imgs/settings.png" alt="System settings" loading="lazy" decoding="async">
  <figcaption>Settings: basic, network, token, mail, security, logs, quota, theme and update groups</figcaption>
</figure>

## Key fields

| Field | Risk |
|---|---|
| Port | wrong value locks you out |
| Bearer token | for API / CLI / plugins only; equals admin, rotate on leak |
| Admin password | set on the initialization page at first visit |
| Public URL | affects redirects |
| SMTP | required for password recovery |
| Registration | keep off on public internet |

## Token

```bash
quickidc conf token show --show-secret
quickidc conf token reset
```

::: danger
Resetting the token invalidates billing plugins, saved CLI configs and external scripts.
:::

## Port

```bash
quickidc conf port set 1881
quickidc core restart
```

Update firewall, reverse proxy and plugin settings afterwards.
