# Product characteristics

## Controller delivery

CloudHost is distributed as one executable. It uses SQLite by default and also supports MySQL and PostgreSQL. Static assets and the noVNC console are included with the release.

## Platform drivers

Each platform has a driver and capability metadata (`enabled`, `is_remote`, `ban_init`, `tab_lock`, `messages`). The console uses this metadata to display fields and available operations.

## Networking

OpenIDCS includes NAT port forwarding, iKuai DHCP/ARP binding, Caddy reverse proxy with TLS, and VNC (`6080`) / Web SSH (`7681`) proxies.

## Users and billing

The controller manages instance ownership, sharing, access keys, quota recalculation, and billing integrations.

## Tasks and logs

Long-running operations use asynchronous tasks with progress, cancellation, and retry. Logs are written to files and the database. Outbox and tombstone records support reconciliation after failed deletions.

## Extension points

The controller, console, agent, and plugins are released under AGPLv3. Platform drivers implement `HostDriver`; billing plugins call the controller's REST API; CLI commands can be added to `opidcs`.

## Trade-offs

| Dimension | OpenIDCS | Single-platform panel | Full cloud platform |
|---|---|---|---|
| Multi-platform | 10+ platforms | vendor only | usually supported |
| Deployment cost | single binary + SQLite | medium | high |
| Billing | plugins available | usually none | often custom |
| Extensibility | Go + React | product dependent | product dependent |
