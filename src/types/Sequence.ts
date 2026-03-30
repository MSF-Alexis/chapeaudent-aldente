export type SequenceType = 'html' | 'css' | 'js' | 'integration'
export type Difficulty = 'Initial' | 'Basique' | 'Opérationnel' | 'Avancé' | 'Expert'
export type NodeType = 'Sheet' | 'Exercice' | 'MiniProject'

export type SequenceNode = {
  id: string
  type: NodeType
  targetCollection: 'sheets' | 'exercices'
  targetSlug: string
  nextNodeId?: string
}

export type EnrichedSequenceNode = SequenceNode & {
  title?: string
}

export type Sequence = {
  id: string
  slug: string
  name: string
  description?: string
  type: SequenceType
  level: Difficulty
  estimatedHours?: number
  prerequisiteParcours?: string[]
  firstNodeId: string
  nodes: SequenceNode[]
}

export type EnrichedSequence = Omit<Sequence, 'nodes'> & {
  nodes: EnrichedSequenceNode[]
}
