# 魔方财务 IDCSmart 对接

`OpenIDC-IDCSmart` 是魔方财务（IDCSmart）的服务器模块，通过主控 REST API 开通/管理实例。

## 目录

```text
plugins/OpenIDC-IDCSmart/
├── idcserver.php
└── templates/
    ├── info.html
    ├── ipv4.html
    ├── ipv6.html
    ├── nat.html
    └── proxy.html
```

## 安装

1. 把 `OpenIDC-IDCSmart` 目录上传到魔方财务的服务器模块目录（通常为 `public/plugins/server/` 或产品文档指定目录）；
2. 在后台「产品 → 服务器模块」中刷新并选择 `OpenIDC-IDCSmart`；
3. 新建服务器组，填写主控信息。

```bash
# 从主控仓库取插件
git clone https://github.com/OpenIDCSTeam/CloudHost.git /tmp/cloudhost
cp -r /tmp/cloudhost/plugins/OpenIDC-IDCSmart /path/to/idcsmar/modules/server/openidc
chown -R www-data:www-data /path/to/idcsmar/modules/server/openidc
```

## 配置项

| 配置 | 说明 | 示例 |
|---|---|---|
| 主机名称 / `host_name` | 主控里的主机标识 | `pve-lab` |
| 主控地址 | CloudHost 地址（含协议） | `https://idc.example.com` |
| Bearer Token | 系统设置 → 令牌 | `6f1c…` |
| 默认镜像 / `image` | 创建实例使用的镜像名 | `debian12` |
| CPU / `cpus` | 套餐默认核数 | `2` |
| 内存 | MB | `2048` |
| 磁盘 | GB | `40` |
| 带宽 | Mbps（平台支持时） | `10` |

::: tip 配置项以插件代码为准
不同版本的 `idcserver_ConfigOptions()` 字段略有差异，页面表格只列常用项；以实际表单为准。
:::

## 开通流程

1. 用户下单 → 魔方调用 `idcserver_CreateAccount`；
2. 插件调用主控 `POST /api/client/create/:hs_name`；
3. 主控异步创建实例并返回任务；
4. 插件轮询/等待结果，写入实例 UUID；
5. 用户在产品详情点击「控制台」，插件调用 `templogin` 换取临时入口。

## 续费 / 暂停 / 删除

| 动作 | 插件函数 | 主控接口 |
|---|---|---|
| 续费 | `idcserver_Renew` | `PUT /api/client/update/...` |
| 暂停 | `idcserver_SuspendAccount` | 关机 / 暂停 |
| 解除暂停 | `idcserver_UnsuspendAccount` | 开机 |
| 删除 | `idcserver_TerminateAccount` | `DELETE /api/client/delete/...` |
| 改密 | `idcserver_ChangePassword` | `POST /api/client/password/...` |

## 验证

- [ ] 插件目录权限正确（Web 用户可读）
- [ ] 后台能保存服务器配置
- [ ] 下单后主控出现实例
- [ ] 控制台按钮可打开
- [ ] 删除产品后实例被回收

## 常见问题

| 现象 | 处理 |
|---|---|
| 保存配置报错 | 检查 PHP 版本与目录权限 |
| 开通失败 401 | Token 错误或已轮换 |
| 开通失败 404 | `host_name` 与主控不一致 |
| 控制台打不开 | 主控 6080 未放行 / 反代未配置 |
| 中文乱码 | 文件保存为 UTF-8 无 BOM |
