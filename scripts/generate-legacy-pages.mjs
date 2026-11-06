// 依据 legacy-redirects.json 生成旧路径的静态跳转页。
// GitHub Pages 无法下发真正的 301，这里用 meta refresh + canonical 兜底。
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '..')
const mapPath = join(root, 'docs/.vitepress/legacy-redirects.json')
const outRoot = join(root, 'docs/public')

const map = JSON.parse(await readFile(mapPath, 'utf8'))

const page = (target) => `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="refresh" content="0; url=${target}">
<link rel="canonical" href="${target}">
<title>页面已迁移 · OpenIDCS</title>
<style>body{font-family:system-ui,sans-serif;background:#f7f9ff;color:#0f1b2d;display:grid;place-items:center;min-height:100vh;margin:0}a{color:#2f6bff}</style>
</head>
<body>
<p>文档已迁移到 <a href="${target}">${target}</a>，正在跳转…</p>
</body>
</html>
`

let count = 0
for (const [from, to] of Object.entries(map)) {
  if (!from || from === to) continue
  const clean = from.replace(/^\//, '').replace(/\/$/, '')
  if (!clean) continue
  const file = join(outRoot, `${clean}.html`)
  await mkdir(dirname(file), { recursive: true })
  await writeFile(file, page(to), 'utf8')
  count += 1
}

console.log(`[legacy] generated ${count} redirect page(s)`)
