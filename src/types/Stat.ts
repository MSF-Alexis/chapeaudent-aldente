import type { SheetType } from "@/types/Sheet"

export const TYPES = ['html', 'css', 'js', 'integration']
export type EntitiesCount = {
  sheets: Entities[]
  sequences: Entities[]
  exercices: Entities[]
}

export type Entities = {
  type : SheetType,
  count : number
}
