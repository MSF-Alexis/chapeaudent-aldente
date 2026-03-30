import { nextTick } from 'vue'
import Prism from 'prismjs'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-javascript'

type LangKey = 'html' | 'css' | 'js'

type LangConfig = {
  prismLang: string
  cssClass: string
  prismDef: Prism.Grammar
}

const LANGUAGE_MAP: Record<LangKey, LangConfig> = {
  html: {
    prismLang: 'markup',
    cssClass: 'language-markup',
    prismDef: Prism.languages.markup!,
  },
  css: {
    prismLang: 'css',
    cssClass: 'language-css',
    prismDef: Prism.languages.css!,
  },
  js: {
    prismLang: 'javascript',
    cssClass: 'language-javascript',
    prismDef: Prism.languages.javascript!,
  },
}

const getLangConfig = (key: string): LangConfig => LANGUAGE_MAP[key as LangKey] ?? LANGUAGE_MAP.html

function detectLanguageFromCode(rawCode: string, defaultType = 'css'): string {
  const trimmed = rawCode.trim()

  const looksLikeHtml =
    /<\s*html[\s>]/i.test(trimmed) ||
    /<\s*head[\s>]/i.test(trimmed) ||
    /<\s*body[\s>]/i.test(trimmed) ||
    /<\s*(div|p|h1|h2|h3|link|meta)[\s>]/i.test(trimmed) ||
    /<!DOCTYPE\s+html>/i.test(trimmed)

  if (looksLikeHtml) return 'html'
  return defaultType
}

export function prettifyCode(contentString: string, options = { type: 'css' }): string {
  if (!contentString) return ''

  const { type = 'css' } = options

  return contentString.replace(
    /<pre>\s*<code>([\s\S]*?)<\/code>\s*<\/pre>/gi,
    (_fullMatch, rawCode: string) => {
      const separator = '/* Fichier CSS (style.css) */'
      const index = rawCode.indexOf(separator)

      if (index === -1) {
        const langConfig = getLangConfig(detectLanguageFromCode(rawCode, type))
        const highlighted = Prism.highlight(rawCode, langConfig.prismDef, langConfig.prismLang)
        return `<pre><code class="${langConfig.cssClass}">${highlighted}</code></pre>`
      }

      const htmlPart = rawCode.slice(0, index).trimEnd()
      const cssPart = rawCode.slice(index).trimStart()

      const htmlConfig = LANGUAGE_MAP.html
      const cssConfig = LANGUAGE_MAP.css

      const htmlHighlighted = Prism.highlight(htmlPart, htmlConfig.prismDef, htmlConfig.prismLang)
      const cssHighlighted = Prism.highlight(cssPart, cssConfig.prismDef, cssConfig.prismLang)

      return `
<pre><code class="${htmlConfig.cssClass}">${htmlHighlighted}</code></pre>
<pre><code class="${cssConfig.cssClass}">${cssHighlighted}</code></pre>
      `.trim()
    },
  )
}

export function formatId(rawId: string | null | undefined, prefix = '#'): string {
  if (!rawId) return ''
  const match = rawId.match(/\d+/)
  return match ? `${prefix}${match[0]}` : ''
}

export async function copyElementValue(
  feedBackElement: { value: string },
  querySelector = '.fiche-detail__exemple pre',
): Promise<void> {
  await nextTick()
  const preEl = document.querySelector(querySelector)
  if (!preEl) return

  const codeEl = preEl.querySelector('code')
  const text = codeEl ? (codeEl.textContent ?? '') : (preEl.textContent ?? '')

  try {
    await navigator.clipboard.writeText(text)
    feedBackElement.value = 'Code copié !'
    setTimeout(() => (feedBackElement.value = 'Copier le code'), 2000)
  } catch {
    feedBackElement.value = 'Impossible de copier'
    setTimeout(() => (feedBackElement.value = 'Copier le code'), 2000)
  }
}

type CodeBlock = {
  id: number
  content: string
}

type ExtractResult = {
  processedHtml: string
  codeBlocks: CodeBlock[]
}

export function extractCodeBlocks(htmlString: string): ExtractResult {
  if (!htmlString) return { processedHtml: '', codeBlocks: [] }

  const codeBlocks: CodeBlock[] = []
  let index = 0

  const processedHtml = htmlString.replace(/<code>(.*?)<\/code>/gs, (_match, content: string) => {
    const decodedContent = content
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')

    codeBlocks.push({ id: index, content: decodedContent.trim() })
    const placeholder = `<span data-code-block="${index}"></span>`
    index++
    return placeholder
  })

  return { processedHtml, codeBlocks }
}
