# SwapIDC 对接

`OpenIDC-SwapIDC` 面向经典 SwapIDC 财务系统，插件入口为 `openidc.php`。

## 目录

```text
plugins/OpenIDC-SwapIDC/
├── openidc.php
├── clientarea.tpl
├── whm.lib.php
├── version
└── lang/Chinese.php
```

## 安装

```bash
git clone https://github.com/OpenIDCSTeam/CloudHost.git /tmp/cloudhost
cp -r /tmp/cloudhost/plugins/OpenIDC-SwapIDC /path/to/swapidc/mods/server/openidc
chown -R www-data:www-data /path/to/swapidc/mods/server/openidc
```

在 SwapIDC 后台启用服务器模块，新建服务器。

## 配置

| 配置 | 说明 | 示例 |
|---|---|---|
| 节点地址 | CloudHost 地址 | `https://idc.example.com` |
| 节点 Token | 主控 Bearer Token | `6f1c…` |
| 节点 ID / `host_name` | 主控主机标识 | `pve-lab` |
| 默认镜像 | 实例镜像 | `debian12` |
| 套餐规格 | CPU / 内存 / 磁盘 / 带宽 | `2 / 2048 / 40 / 10` |
| 产品类型 | 容器 / 虚拟机 | 视平台 |

## 开通流程

```text
用户下单 → openidc_CreateAccount
        → POST /api/client/create/:hs_name
        → 主控异步创建
        → 插件记录 vm_uuid
        → 用户点击「管理」→ templogin
```

## 验证

- [ ] 模块在后台可见
- [ ] 服务器配置可保存
- [ ] 下单成功并生成实例
- [ ] 用户面板能看到 IP / 控制台
- [ ] 删除服务后实例回收

## 常见问题

| 现象 | 处理 |
|---|---|
| 模块列表不显示 | 目录名 / 权限 / PHP 版本 |
| 开通 401 | Token 不匹配 |
| 开通 404 | 节点 ID 与 `hs_name` 不一致 |
| 控制台白屏 | 主控 6080 未放行 |
| 中文乱码 | 文件编码改为 UTF-8 |
