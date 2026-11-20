import type MarkdownIt from 'markdown-it'

/**
 * 把 ```mermaid 代码块交给客户端组件渲染。
 * 组件内部按主题（浅色 / 深色）延迟加载 mermaid，只在出现图表的页面加载。
 */
export function mermaidMarkdownPlugin(md: MarkdownIt) {
  const defaultFence = md.renderer.rules.fence

  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const token = tokens[idx]
    const language = token.info.trim().split(/\s+/)[0]

    if (language !== 'mermaid') {
      if (defaultFence) return defaultFence(tokens, idx, options, env, self)
      return self.renderToken(tokens, idx, options)
    }

    return `<MermaidDiagram code="${encodeURIComponent(token.content)}" />\n`
  }
}
