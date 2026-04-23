export type Roadmap = {
  id?: string
  sequenceSlugs: string[]
}

export type EnrichedRoadmapItem = {
  slug: string
  title: string
  description?: string
}

export type EnrichedRoadmap = {
  id: string
  sequenceSlugs: string[]
  sequences: EnrichedRoadmapItem[]
}