/**
 * 侧边栏同路由点击兜底
 *
 * 背景：VitePress 的 router 在 window 捕获阶段对所有站内链接 preventDefault()，
 * 其中「目标路由 == 当前路由」时只做 window.scrollTo(0, 0)，不再有任何提示。
 * 结果是点击侧边栏里当前页的条目（尤其是当前分区的标题）经常"一点反应都没有"。
 *
 * 这里在 window 捕获阶段抢在 router 之前处理同路由点击：
 *   - 当前分区的标题（带 caret）→ 展开 / 收起该分区
 *   - 当前页面的条目 → 平滑回到页首
 * 其它情况一律放行，交给 VitePress 正常路由。
 *
 * 注意：必须在模块加载时（早于主题 createApp）注册，才能先于 router 的监听器执行。
 */

const SIDEBAR_ANCHOR = '.VPSidebar a.link'

/** 归一化路径：去掉 index.html / .html 与末尾斜杠，便于比较同路由 */
function normalizePath(pathname: string): string {
  let path = pathname.replace(/index\.html$/, '').replace(/\.html$/, '')
  if (path.length > 1) path = path.replace(/\/+$/, '')
  return path || '/'
}

function isSameRoute(anchor: HTMLAnchorElement): boolean {
  if (!anchor.origin || anchor.origin !== window.location.origin) return false
  // 带不同锚点时交给浏览器默认行为（跳到页内位置）
  if (anchor.hash && anchor.hash !== window.location.hash) return false
  return normalizePath(anchor.pathname) === normalizePath(window.location.pathname)
}

function onClick(event: MouseEvent): void {
  if (event.button !== 0) return
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

  const target = event.target as Element | null
  const anchor = target?.closest?.(SIDEBAR_ANCHOR) as HTMLAnchorElement | null
  if (!anchor) return
  if (anchor.target && anchor.target !== '_self') return
  if (!isSameRoute(anchor)) return

  // 抢在 VitePress 的 router 之前接管：否则会被强制 scrollTo(0, 0)
  event.preventDefault()
  event.stopPropagation()

  const row = anchor.parentElement
  const caret = row?.querySelector<HTMLElement>(':scope > .caret')
  if (caret) {
    // 当前分区标题：折叠 / 展开，而不是"什么都没发生"
    caret.click()
    return
  }

  window.scrollTo({ top: 0, behavior: 'smooth' })
}

export function registerSidebarClickGuard(): void {
  if (typeof window === 'undefined') return
  const flag = '__oidcSidebarClickGuard__'
  const host = window as unknown as Record<string, unknown>
  if (host[flag]) return
  host[flag] = true
  window.addEventListener('click', onClick, true)
}

registerSidebarClickGuard()
