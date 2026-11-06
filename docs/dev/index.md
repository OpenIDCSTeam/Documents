# 开发指南

这一章面向想参与 OpenIDCS 开发的人：如何搭环境、构建、调试、提交与发布。

## 仓库与职责

| 仓库 | 语言 | 入口 |
|---|---|---|
| CloudHost | Go | `cmd/server`、`cmd/opidcs` |
| FrontPage | TypeScript / React | `src/main.tsx` |
| CloudInit | Go | `main.go` |
| Documents | Markdown / Vue | `docs/` |

## 快速开始

```bash
# 主控
git clone https://github.com/OpenIDCSTeam/CloudHost.git
cd CloudHost
go mod download
go run ./cmd/server --data-dir ./data

# 前端
git clone https://github.com/OpenIDCSTeam/FrontPage.git
cd FrontPage
npm install
npm run dev

# 文档
git clone https://github.com/OpenIDCSTeam/Documents.git
cd Documents
npm install
npm run dev
```

## 开发约定

- 主控遵循「Handler → Service → Driver → Data」分层，不在 Handler 写业务；
- 平台能力变更必须同步 `engine_config.go`；
- 新增接口要补 `internal/api` 测试；
- 前端类型与接口契约放在 `src/types`，避免 `any`；
- 文档中的端口、参数、接口名必须来自代码。

## 代码地图

| 想改什么 | 去哪 |
|---|---|
| 新增平台 | `internal/driver/*_driver.go` + `interface.go` + `engine_config.go` |
| 新增接口 | `internal/api/app.go` 注册 + handler + service |
| 调度/任务 | `internal/task`、`internal/scheduler` |
| 登录/权限 | `internal/auth`、`internal/middleware` |
| 前端页面 | `FrontPage/src/pages` |
| 财务插件 | `CloudHost/plugins/<name>` |
| 文档 | `Documents/docs/<section>` |

## 提交前检查

```bash
# CloudHost
go build ./...
go vet ./...
go test ./...

# FrontPage
npx tsc --noEmit
npm run build

# Documents
npm run build
```

## 相关页面

- [环境搭建](/dev/environment)
- [构建与调试](/dev/build)
- [代码规范](/dev/conventions)
- [发布流程](/dev/release)
