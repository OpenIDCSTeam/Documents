# Easypanel-SwapIDC 对接

`Easypanel-SwapIDC` 用于把 OpenIDCS 接到 EasyPanel 面板的售卖流程，插件入口为 `easypanel.php`。

## 目录

```text
plugins/Easypanel-SwapIDC/
├── easypanel.php
├── clientarea.tpl
├── whm.lib.php
├── version
└── lang/Chinese.php
```

## 安装

```bash
cp -r plugins/Easypanel-SwapIDC /path/to/easypanel/mods/server/openidc
chown -R www-data:www-data /path/to/easypanel/mods/server/openidc
```

在 EasyPanel 后台启用模块并添加服务器。

## 配置

| 配置 | 说明 |
|---|---|
| 接口地址 | CloudHost 地址（HTTPS） |
| API Token | 主控 Bearer Token |
| 节点标识 | `hs_name` |
| 镜像 / 套餐 | 与主控镜像名一致 |

## 适用场景

| 场景 | 说明 |
|---|---|
| 已有 EasyPanel 计费 | 保留原有计费，资源由 OpenIDCS 提供 |
| 多平台混合售卖 | 同一面板下挂不同 `hs_name` 的主机 |

## 验证

- [ ] 模块可启用
- [ ] 下单开通成功
- [ ] 用户面板显示实例信息
- [ ] 删除服务回收资源

## 常见问题

| 现象 | 处理 |
|---|---|
| 接口超时 | 主控不可达或 TLS 证书无效 |
| Token 失效 | 重新生成并更新模块配置 |
| 无法开机 | 主机离线 / 平台任务失败 |
