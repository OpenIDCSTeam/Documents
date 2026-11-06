# VistaPanel-SwapIDC 对接

`VistaPanel-SwapIDC` 面向 VistaPanel 面板，插件入口为 `VistaPanel.php`。

## 目录

```text
plugins/VistaPanel-SwapIDC/
├── VistaPanel.php
├── clientarea.tpl
├── version
└── lang/Chinese.php
```

## 安装

```bash
cp -r plugins/VistaPanel-SwapIDC /path/to/vistapanel/mods/server/openidc
chown -R www-data:www-data /path/to/vistapanel/mods/server/openidc
```

在 VistaPanel 后台启用模块，配置服务器。

## 配置

| 配置 | 说明 | 示例 |
|---|---|---|
| 主控地址 | CloudHost | `https://idc.example.com` |
| Token | Bearer Token | `6f1c…` |
| 主机标识 | `hs_name` | `lxd-edge` |
| 镜像 | 镜像名 | `debian12` |
| 规格 | CPU / 内存 / 磁盘 | `1 / 1024 / 20` |

## 与 Easypanel 版的差异

| 项目 | Easypanel 版 | VistaPanel 版 |
|---|---|---|
| 入口 | `easypanel.php` | `VistaPanel.php` |
| 语言包 | `lang/Chinese.php` | `lang/Chinese.php` |
| 模板 | `clientarea.tpl` | `clientarea.tpl` |
| 适配层 | EasyPanel API | VistaPanel API |

## 验证

- [ ] 模块启用成功
- [ ] 下单开通实例
- [ ] 控制台入口可用
- [ ] 删除服务回收资源

## 常见问题

| 现象 | 处理 |
|---|---|
| 模块加载失败 | PHP 版本 / 文件权限 |
| 401 | Token 错误 |
| 404 | `hs_name` 不存在 |
| 开通慢 | 主控任务队列拥堵，查看任务详情 |
