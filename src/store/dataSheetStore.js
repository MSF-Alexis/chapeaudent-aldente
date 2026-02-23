import fichesHtml from '@/assets/data/fiches_html.json'
import fichesCss from '@/assets/data/fiches_css.json'
import fichesJs from '@/assets/data/fiches_js.json'
import fichesIntegration from '@/assets/data/fiches_integration.json'

export function useDataSheetsStore() {
  return {
    html: fichesHtml,
    css: fichesCss,
    js: fichesJs,
    integration: fichesIntegration,
  }
}
