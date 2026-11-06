# Environment

## Required

| Tool | Version | Purpose |
|---|---|---|
| Go | 1.26+ | controller, CloudInit, CLI |
| Node.js | 18+ | frontend and docs |
| npm | 9+ | packages |
| Git | 2.30+ | — |

Optional: Rust/Cargo (Tauri), Inno Setup (Windows installer), Docker (local platform tests), PHP 8 (plugins).

## Clone

```bash
mkdir -p ~/openidcs && cd ~/openidcs
git clone https://github.com/OpenIDCSTeam/CloudHost.git
git clone https://github.com/OpenIDCSTeam/FrontPage.git
git clone https://github.com/OpenIDCSTeam/CloudInit.git
git clone https://github.com/OpenIDCSTeam/Documents.git
```

## Go

```bash
go version
cd CloudHost
go mod download
go build ./...
```

::: tip No CGO
SQLite uses `modernc.org/sqlite`; gcc/MinGW is not required.
:::

## Frontend

```bash
cd FrontPage
npm install
npm run dev
```

## Docs

```bash
cd Documents
npm install
npm run dev
npm run build
```

## Desktop (optional)

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Debian / Ubuntu
sudo apt install -y libwebkit2gtk-4.1-dev build-essential curl wget file \
  libxdo-dev libssl-dev libayatana-appindicator3-dev librsvg2-dev

cd CloudHost/tools/opidcs-gui
npm install
npm run tauri dev
```

## Troubleshooting

| Symptom | Fix |
|---|---|
| module not found | set GOPROXY |
| npm slow | use a mirror |
| Tauri missing libs | install WebKitGTK deps |
| port in use | change `--port` |
