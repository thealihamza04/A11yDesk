import jsonData from '@mcp-data/checklist.json'
import { CHECKLIST as _CHECKLIST, CATEGORIES } from './checklist'
import type { ChecklistItem, Level } from './types'

type JsonItem = {
  id: string
  title: string
  category: string
  wcag: string
  wcagTitle: string
  wcagUrl: string
  level: string
  obsolete?: boolean
  description: string
  whyItMatters: string
}

const jsonMap = Object.fromEntries(
  (jsonData.items as JsonItem[]).map(i => [i.id, i])
)

export const CHECKLIST: ChecklistItem[] = _CHECKLIST.map(item => {
  const meta = jsonMap[item.id]
  if (!meta) return item
  return {
    ...item,
    title: meta.title,
    description: meta.description,
    whyItMatters: meta.whyItMatters,
    wcag: meta.wcag,
    wcagTitle: meta.wcagTitle,
    wcagUrl: meta.wcagUrl,
    level: meta.level as Level,
    obsolete: meta.obsolete,
  }
})

export { CATEGORIES }
