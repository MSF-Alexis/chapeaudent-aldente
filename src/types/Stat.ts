import type { SheetType } from "@/types/Sheet"

export type EntitiesCount = {
  sheets: Entities[]
  sequences: Entities[]
  exercices: Entities[]
}

export type Entities = {
  type : SheetType,
  count : number
}
