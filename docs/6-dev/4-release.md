# 发布流程

## 主控（CloudHost）

### 触发

- 推送 `v*` tag；
- 或在 Actions 手动运行 `Release` 工作流。

```bash
git tag v1.0.0
git push origin v1.0.0
```

### 产物

| 文件 | 内容 |
|---|---|
| `hostagent-linux-amd64.tar.gz` | 二进制 + static + VNCConsole |
| `hostagent-linux-arm64.tar.gz` | 同上 |
| `hostagent-windows-amd64.zip` | 免安装包 |
| `OpenIDCS-HostAgent-<ver>-win-x64-setup.exe` | Inno Setup 服务安装包 |

Windows 安装包会注册 `OpenIDCS-HostAgent` 服务（NSSM），macOS pkg 任务默认注释。

### 发布前检查

- [ ] `go build ./...`、`go vet ./...`、`go test ./...` 通过
- [ ] 前端已构建并同步到 `static/`
- [ ] 版本号与 tag 一致
- [ ] Release Notes 写清破坏性变更

## 前端（FrontPage）

前端随主控发布，不单独发版：

```bash
npm run build
rm -rf ../CloudHost/static/assets
cp -r dist/* ../CloudHost/static/
```

提交 `static/` 变更后，再按主控流程发版。

## CloudInit

独立 tag，产物为多平台二进制；Agent 自动更新读取 Releases 的 `latest`。

## 文档（Documents）

```bash
npm run build
git push origin main
```

GitHub Actions 自动部署到 Pages。`base` 由 `DOCS_BASE` 控制，自定义域名时为 `/`。

## CLI / Desktop

| 组件 | 产物 |
|---|---|
| `opidcs` | `opidcs-{linux,darwin,windows}-{amd64,arm64}` |
| Desktop | `*-setup.exe`、`*.AppImage`、`*.dmg`、`latest.json` |

自动更新签名：

- 私钥存 GitHub Secrets（`TAURI_SIGNING_PRIVATE_KEY`）；
- 公钥写入 `tauri.conf.json`；
- `latest.json` 由发布工作流生成。

## 回滚

| 组件 | 方式 |
|---|---|
| 主控 | 重新安装上一个版本，数据目录不动 |
| 前端 | 回滚 `static/` 与主控版本 |
| 文档 | `git revert` 后推送 |
| CLI/Desktop | 重装旧版本，关闭自动更新 |

## 版本约定

语义化版本 `MAJOR.MINOR.PATCH`：

- MAJOR：不兼容的 API/数据结构变更；
- MINOR：向后兼容的新功能；
- PATCH：修复。

## 相关页面

- [构建与调试](/dev/build)
- [代码规范](/dev/conventions)
