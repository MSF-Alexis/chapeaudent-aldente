import Prism from 'prismjs'
import 'prismjs/components/prism-markup'

export function highlightHtmlExample(htmlString) {
  if (!htmlString) return ''

  const parser = new DOMParser()
  const doc = parser.parseFromString(htmlString, 'text/html')

  doc.querySelectorAll('pre > code').forEach(codeEl => {
    const rawCode = codeEl.textContent || ''
    const highlighted = Prism.highlight(rawCode, Prism.languages.markup, 'markup')
    codeEl.innerHTML = highlighted
    codeEl.classList.add('language-markup')
  })

  return doc.body.innerHTML
}
