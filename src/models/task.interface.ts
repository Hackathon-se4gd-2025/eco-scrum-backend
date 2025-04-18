import { PRIORITY_LEVELS, SusafCategory, TASK_STATUSES } from "src/constants"

export interface Task {
    id: string
    title: string
    description: string
    priority: (typeof PRIORITY_LEVELS)[number]
    sustainabilityContext: string
    status: (typeof TASK_STATUSES)[number]
    comments: number
    subtasks: number
    sustainabilityWeight: number
    assignedTo?: string
    sprintId: string
    storyPoints: number
    sustainabilityPoints: number
    relatedSusafEffects?: string[]
    definitionOfDone?: string
    tags?: string[]
    sustainable: boolean
    susafCategory?: SusafCategory
    order: number
    projectId: string
  }