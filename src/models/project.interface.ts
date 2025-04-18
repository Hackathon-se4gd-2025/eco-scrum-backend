import { TeamMember } from "./teamMember.interface"

export interface Project {
    id: string
    name: string
    description: string
    createdAt: string
    createdBy: string
    teamMembers: TeamMember[]
    sprints: string[] // Sprint IDs
  }