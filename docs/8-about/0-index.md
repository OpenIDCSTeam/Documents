# 关于 OpenIDCS

OpenIDCS（Open Internet Data Center System）是开源 IDC 虚拟化管理平台，支持管理多种虚拟化平台上的主机和实例，并提供网络配置、用户管理与财务系统插件。

## 项目信息

| 项目 | 内容 |
|---|---|
| 名称 | OpenIDCS |
| 协议 | AGPLv3 |
| 主控仓库 | [OpenIDCSTeam/CloudHost](https://github.com/OpenIDCSTeam/CloudHost) |
| 前端仓库 | [OpenIDCSTeam/FrontPage](https://github.com/OpenIDCSTeam/FrontPage) |
| Agent 仓库 | [OpenIDCSTeam/CloudInit](https://github.com/OpenIDCSTeam/CloudInit) |
| 文档仓库 | [OpenIDCSTeam/Documents](https://github.com/OpenIDCSTeam/Documents) |
| 文档站 | 当前站点（自定义域名） |
| 镜像 | `openidcsteam/openidcs`（Docker Hub） |

## 设计取向

1. **简单优先**：单二进制、单数据库、少依赖；
2. **能力显式**：平台支持什么写在元信息里，不靠猜；
3. **接口规范**：REST API 以 `/api` 为前缀，支持 Bearer Token 和浏览器 Session；
4. **可运维**：任务、日志、对账、墓碑，失败可追踪可重试；
5. **开放**：AGPLv3，欢迎二次开发与插件扩展。

## 参与方式

| 方式 | 说明 |
|---|---|
| 反馈问题 | 在对应仓库提 Issue，附版本、日志、复现步骤 |
| 提交代码 | Fork → 分支 → PR，跑通构建与测试 |
| 写文档 | 修正错误、补充教程，文档仓库同样欢迎 PR |
| 分享部署经验 | 在 Discussions / 社区发帖 |

## 相关页面

- [团队介绍](/about/team)
- [开源协议](/about/license)
- [免责声明](/about/disclaimer)
- [开发指南](/dev/)
