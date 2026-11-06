# 代码规范

## 通用

- 注释、提交信息、文档统一使用中文（代码标识符用英文）；
- 不提交构建产物（`static/` 除外，按发布流程同步）；
- 不提交 `DataSaving/`、`node_modules/`、`.env`；
- 每个 PR 只做一件事，附带验证方式。

## Go

### 分层

```text
Handler  只做参数解析、鉴权、响应
Service  业务编排、事务、任务提交
Driver   平台交互、能力判定
Data     SQL / 查询
```

- Handler 不写业务规则；
- Service 不拼 SQL；
- Driver 不返回 HTTP 错误；
- 错误用 `fmt.Errorf("...: %w", err)` 包装。

### 命名与结构

| 类型 | 规范 | 示例 |
|---|---|---|
| 包 | 小写单词 | `driver`、`service` |
| 文件 | 小写下划线 | `vm_handlers.go` |
| 导出 | PascalCase | `CreateVM` |
| 私有 | camelCase | `resolveBinary` |
| 常量 | 全大写或 Camel | `vncProxyPort` |

### 必做

```bash
gofmt -w .
go vet ./...
go test ./...
```

- 新增平台 driver 必须实现 `HostDriver` 全量方法；
- 新增接口必须有鉴权与参数校验；
- 涉及 shell 的命令必须走 `shellsafe` 或参数化。

## TypeScript / React

- 使用函数组件 + Hooks；
- 类型放 `src/types`，禁止 `any`（确需时写 `unknown` + 收窄）；
- API 调用统一走 `src/utils/apis.ts`；
- 样式优先使用现有 token / class，不硬编码颜色；
- 组件文件不超过约 300 行，超出拆分。

```bash
npx tsc --noEmit
npm run build
```

## 文档

- 端口、参数、接口名必须能在代码中找到；
- 占位内容用 `oidc-todo` 块标注，不要写「似乎」「可能」；
- 每个页面首段说明「这页解决什么问题」；
- 链接使用站内绝对路径（`/deploy/...`）。

## 提交信息

```text
<type>(<scope>): <subject>

<body>
```

| type | 用途 |
|---|---|
| feat | 新功能 |
| fix | 修复 |
| docs | 文档 |
| refactor | 重构 |
| test | 测试 |
| chore | 构建/杂项 |
| style | 格式 |

示例：

```text
feat(vnc): 集成 noVNC 控制台并增强 VNC 代理

- 新增 VNCConsole 静态资源
- 增强 token 校验
```

## 分支

| 分支 | 用途 |
|---|---|
| `main` | 稳定分支，可发布 |
| `feat/*` | 功能 |
| `fix/*` | 修复 |
| `docs/*` | 文档 |

## 相关页面

- [构建与调试](/dev/build)
- [发布流程](/dev/release)
