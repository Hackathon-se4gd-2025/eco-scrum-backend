import { PRIORITY_LEVELS, TASK_STATUSES, SusafCategory } from "src/constants"

export interface BacklogItem {
    id: string
    title: string
    description: string
    priority: (typeof PRIORITY_LEVELS)[number]
    sustainable: boolean
    storyPoints: number
    sustainabilityScore: number
    status: (typeof TASK_STATUSES)[number]
    susafCategory?: SusafCategory
    assignedTo?: string
    sprintId?: string
    projectId: string
    sustainabilityPoints?: number
    relatedSusafEffects?: string[]
    definitionOfDone?: string
    tags?: string[]
  }