export interface Sprint {
    id: string
    name: string
    goal: string
    startDate: string
    endDate: string
    progress: number
    sustainabilityScore: number
    previousScore: number
    effectsTackled: number
    tasks: string[] // Task IDs
    projectId: string
    retrospective?: {
      goalMet: "Yes" | "No" | "Partially"
      inefficientProcesses: string
      improvements: string
      teamNotes: string
    }
  }