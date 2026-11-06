# 系统设置

<div class="oidc-todo">
  <span class="oidc-todo__label">待补充 · 维护者亲自撰写</span>
  <p>系统设置涉及安全与运行参数，正文与截图由维护者补充。本页先给出字段分组与操作风险提示。</p>
</div>

## 页面分组

| 分组 | 内容 |
|---|---|
| 基础设置 | 站点名称、Logo、语言、注册开关 |
| 网络 | 主控端口、对外地址、VNC / SSH 端口 |
| 令牌 | 查看 / 设置 / 重置 Bearer Token |
| 管理员 | 重置管理员密码 |
| 邮件 | SMTP 服务器、发件人、测试邮件 |
| 安全 | 登录失败限制、验证码（Turnstile） |
| 日志 | 保留天数、级别 |
| 配额 | 全局默认配额 |
| 主题 | 前端默认主题与预设 |
| 升级 | 版本信息、更新检查 |

## 关键字段

| 字段 | 说明 | 风险 |
|---|---|---|
| 端口 | 主控监听端口，修改后需重启 | 改错会失联 |
| Bearer Token | API 与插件凭据 | 等同管理员，泄露须立即重置 |
| 管理员密码 | 初始值 = 首个 Token | 首次登录后必须改 |
| 对外地址 | 反代/控制台回跳地址 | 影响登录回调 |
| SMTP | 找回密码依赖 | 配错收不到邮件 |
| 注册开关 | 是否允许自助注册 | 公网建议关闭 |

## Token 操作

```bash
opidcs conf token show --show-secret
opidcs conf token reset
```

::: danger 重置 Token 的影响
所有财务插件、`opidcs` 已保存的配置、外部脚本都会立即失效。重置后请同步更新：
财务系统服务器配置、`~/.config/opidcs/config.yaml`、CI Secrets。
:::

## 管理员密码

```bash
opidcs conf admin reset --password '<NEW>'
```

或在登录页使用「忘记密码」（需 SMTP）。

## 端口修改

```bash
opidcs conf port set 1881
opidcs core restart
```

修改后记得同步防火墙、反向代理与财务插件里的地址。

## 待维护者补充

- [ ] 每个分组的截图与逐项说明
- [ ] 反向代理 + HTTPS 的推荐配置
- [ ] 邮件模板与发信测试
- [ ] 多语言与主题的默认值策略
- [ ] 升级/回滚步骤

## 相关页面

- [主控安装](/deploy/core-install)
- [财务系统对接](/deploy/finance/)
- [opidcs 命令行](/tools/cli)
