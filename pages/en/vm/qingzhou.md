---
title: Qingzhou Cloud Configuration
date: 2026-01-01
updated: 2026-04-24
categories:
  - VM Configuration
---

# Qingzhou Cloud Configuration

This guide shows how to connect **Qingzhou Cloud** to OpenIDCS. Qingzhou is a public-cloud-API backed integration that lets users bring their existing cloud resources under unified OpenIDCS management.

## ✨ Pros & Cons

### 👍 Pros

- **Zero infrastructure** — just register an account
- **Elastic billing** — pay as you go, no fixed investment
- **High availability** — backed by the cloud provider's SLA
- **Complete API** — full REST API from the vendor
- **Easy multi-AZ** — cross-AZ deployment out of the box

### 👎 Cons

- **Long-term cost** — more expensive than self-hosted over time
- **Network dependency** — stable internet between OpenIDCS and the cloud API is required
- **Limited low-level operations** — no PCI passthrough, etc.
- **Data sovereignty** — data lives in the provider's DC

### 🎯 Recommended Scenarios

- You already have Qingzhou resources and want unified management
- Hybrid cloud: local + cloud
- Temporary capacity bursts

## 🖥️ Prerequisites

| Item | Requirement |
|------|-------------|
| **Qingzhou account** | Real-name verified |
| **AccessKey** | Created in the console |
| **API Endpoint** | Vendor API gateway URL |
| **Network** | OpenIDCS manager can reach the public internet |

## 🚀 Integration Steps

### Step 1: Create an AccessKey in the Qingzhou Console

1. Sign in to the Qingzhou console
2. **Account Center → AccessKey Management**
3. Click **Create AccessKey**
4. Save the **AccessKey ID** and **AccessKey Secret** (Secret is shown only once)

::: warning
An AccessKey has full account privileges. In production:
- Use a sub-account with least privilege
- Enable IP allow-listing
- Rotate keys regularly
:::

### Step 2: (Recommended) Create a Sub-Account

```
Console → Account → Users → Create User
  Username: openidcs-service
  Access: Programmatic

Policies:
  - ECS read-only + instance ops
  - VPC read-only
  - Monitoring read
```

Generate a dedicated AccessKey for the sub-account and give it to OpenIDCS.

### Step 3: Find the API Endpoint

Examples:

| Region | Endpoint |
|--------|----------|
| North | `https://api.qingzhou.cn` |
| East | `https://api-hd.qingzhou.cn` |
| South | `https://api-hs.qingzhou.cn` |

Check your actual purchased region.

### Step 4: Test API Connectivity

```bash
curl -I https://api.qingzhou.cn

python -c "
import requests
r = requests.get('https://api.qingzhou.cn/v1/regions')
print(r.status_code, r.text[:200])
"
```

### Step 5: (Optional) Configure Local Network

If you want OpenIDCS to do NAT port-forwarding / Web reverse proxy for your Qingzhou VMs:

- Give the OpenIDCS manager a public IP, **or**
- Connect the VPC via VPN / dedicated line.

### Step 6: Prepare Images & Flavors

Qingzhou creates instances via **image ID** and **flavor ID**:

```
Console → Cloud Host → Image Management
  Record the image IDs you need (image-xxxx)

Console → Cloud Host → Flavor Management
  Record the flavor IDs you need (flavor-xxxx)
```

Fill these IDs in OpenIDCS VM templates.

## 🔗 Add Host in OpenIDCS

1. Open the OpenIDCS Web UI
2. **Host Management → Add Host**
3. Fill in:

   | Field | Value |
   |-------|-------|
   | Name | `qingzhou-01` |
   | Type | `Qingzhou Cloud` |
   | API Endpoint | `https://api.qingzhou.cn` |
   | Region | `cn-north-1` |
   | AccessKey ID | AccessKey ID |
   | AccessKey Secret | AccessKey Secret |
   | VPC ID | target VPC (optional) |
   | Default Image | `image-xxxxx` |
   | Default Flavor | `flavor-xxxxx` |

4. Click **Test Connection** — OpenIDCS will call `DescribeRegions` to verify
5. **Save**

## 🧩 Supported Operations

OpenIDCS supports the following via Qingzhou OpenAPI:

| Operation | Notes |
|-----------|-------|
| List instances | All instances in the VPC |
| Create instance | Based on a template |
| Start / Stop / Restart | Power management |
| Destroy | Release the cloud VM |
| Change password `VMPasswd` | Calls `ResetPassword` |
| Rebuild system | Calls `RebuildInstance` |
| Snapshot / Backup | Via vendor snapshot API |
| Disk attach | Elastic cloud disk attach |
| Monitoring | CPU / memory / disk / network |
| VNC Console | `GetVncUrl` returns a password-less URL |

## 🐛 Troubleshooting

### 1. `InvalidSignature`

- Make sure the manager clock is within 15 minutes of the API server
- Make sure the AccessKey Secret has no trailing whitespace

```bash
sudo ntpdate pool.ntp.org   # Linux
w32tm /resync               # Windows
```

### 2. `Forbidden.NoPermission`

Check the sub-account policy in the console:
- Are the required ECS / VPC actions granted?
- Is the resource ARN scope too narrow?

### 3. `Throttling`

- Enable the API cache in OpenIDCS (`qingzhou_cache_ttl`)
- Request a higher QPS quota from the vendor

### 4. Image / Flavor Not Found

- The region must match the image's region
- Make sure the image isn't deleted or pending review

## 🔒 Security

- **Sub-account + least privilege** — never use the root AccessKey
- **IP allow-listing** — restrict the AccessKey to the OpenIDCS manager IP
- **Rotate keys** every 90 days
- **Audit logs** — enable vendor ActionTrail
- **Encrypt at rest** — OpenIDCS stores secrets in SQLite with field-level encryption

## 📚 References

- Qingzhou OpenAPI official docs (Console → Help → API Reference)
- [OpenIDCS HostServer/QingzhouYun.py source](https://github.com/OpenIDCSTeam/OpenIDCS-Client/blob/main/HostServer/QingzhouYun.py)

## Next

- 🏢 [Proxmox VE](/en/vm/proxmox)
- 🐳 [Docker / Podman](/en/vm/docker)
- 🚀 Back to [Quick Start](/en/guide/quick-start)
