import { nextTick } from 'vue'
import Prism from 'prismjs'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-javascript'

const LANGUAGE_MAP = {
  html: {
    prismLang: 'markup',
    cssClass: 'language-markup',
    prismDef: Prism.languages.markup,
  },
  css: {
    prismLang: 'css',
    cssClass: 'language-css',
    prismDef: Prism.languages.css,
  },
  js: {
    prismLang: 'javascript',
    cssClass: 'language-javascript',
    prismDef: Prism.languages.javascript,
  },
}

function detectLanguageFromCode(rawCode, defaultType = 'css') {
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


export function prettifyCode(
  contentString,
  options = { type: 'css' }
) {
  if (!contentString) return ''

  const { type = 'css' } = options

  const processed = contentString.replace(
    /<pre>\s*<code>([\s\S]*?)<\/code>\s*<\/pre>/gi,
    (fullMatch, rawCode) => {
      const separator = '/* Fichier CSS (style.css) */'
      const index = rawCode.indexOf(separator)

      if (index === -1) {
        const effectiveType = detectLanguageFromCode(rawCode, type)
        const langConfig = LANGUAGE_MAP[effectiveType] || LANGUAGE_MAP.html

        const highlighted = Prism.highlight(
          rawCode,
          langConfig.prismDef,
          langConfig.prismLang
        )

        return `<pre><code class="${langConfig.cssClass}">${highlighted}</code></pre>`
      }

      const htmlPart = rawCode.slice(0, index).trimEnd()
      const cssPart = rawCode.slice(index).trimStart()

      const htmlHighlighted = Prism.highlight(
        htmlPart,
        LANGUAGE_MAP.html.prismDef,
        LANGUAGE_MAP.html.prismLang
      )

      const cssHighlighted = Prism.highlight(
        cssPart,
        LANGUAGE_MAP.css.prismDef,
        LANGUAGE_MAP.css.prismLang
      )

      return `
<pre><code class="${LANGUAGE_MAP.html.cssClass}">${htmlHighlighted}</code></pre>
<pre><code class="${LANGUAGE_MAP.css.cssClass}">${cssHighlighted}</code></pre>
      `.trim()
    }
  )

  return processed
}


export function formatId(rawId, prefix = '#') {
  if (!rawId) return ''
  const match = rawId.match(/\d+/)
  return `${prefix}${match}`
}

export async function copyElementValue(
  feedBackElement,
  querySelector = '.fiche-detail__exemple pre'
) {
  await nextTick()
  const preEl = document.querySelector(querySelector)
  if (!preEl) return

  const codeEl = preEl.querySelector('code')
  const text = codeEl ? codeEl.textContent || '' : preEl.textContent || ''
  try {
    await navigator.clipboard.writeText(text)
    feedBackElement.value = 'Code copié !'
    setTimeout(() => (feedBackElement.value = 'Copier le code'), 2000)
  } catch (e) {
    feedBackElement.value = 'Impossible de copier'
    setTimeout(() => (feedBackElement.value = 'Copier le code'), 2000)
  }
}


/**
 * Extrait et remplace les balises <code> par des placeholders
 * @param {string} htmlString - Le HTML contenant des <code>
 * @returns {Object} { processedHtml, codeBlocks }
 */
export function extractCodeBlocks(htmlString) {
  if (!htmlString) return { processedHtml: '', codeBlocks: [] }
  
  const codeBlocks = []
  let index = 0
  
  
  const processedHtml = htmlString.replace(
    /<code>(.*?)<\/code>/gs,
    (match, content) => {
      
      const decodedContent = content
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
      
      codeBlocks.push({
        id: index,
        content: decodedContent.trim()
      })
      
      const placeholder = `<span data-code-block="${index}"></span>`
      index++
      return placeholder
    }
  )
  
  return { processedHtml, codeBlocks }
}
