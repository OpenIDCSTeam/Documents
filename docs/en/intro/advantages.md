# Advantages

## Single binary controller

CloudHost ships as one executable with SQLite embedded. No Python, Node, or external database is required. Static assets and the noVNC console travel with the binary.

## Platform differences are handled in drivers

Each platform exposes capability metadata (`enabled`, `is_remote`, `ban_init`, `tab_lock`, `messages`). The console renders fields and tab locks from that metadata instead of guessing.

## One API for every client

The web console, `opidcs` CLI, and billing plugins all call the same `/api` resources. Implement a capability once and every client gets it.

## Built-in networking

NAT port forwarding, iKuai DHCP/ARP binding, Caddy reverse proxy with automatic TLS, and integrated VNC (`6080`) / Web SSH (`7681`) proxies.

## Built for selling

Instance ownership, sharing, access keys, quota recalculation, and billing plugins are part of the core model.

## Observable and recoverable

Async tasks with progress, cancellation and retry; file and database logs; outbox and tombstone reconciliation for failed deletions.

## Trade-offs

| Dimension | OpenIDCS | Single-platform panel | Full cloud platform |
|---|---|---|---|
| Multi-platform | 10+ platforms, one model | vendor only | usually yes, heavy |
| Deployment cost | single binary + SQLite | medium | high |
| Billing | built-in plugins | none | yes, custom |
| Extensibility | Go + React, clear API | limited | product dependent |
