export type Status = 'Not Started' | 'In Progress' | 'Completed'
export const STATUSES: Status[] = ['Not Started', 'In Progress', 'Completed']

export interface Evidence {
  id: string
  type: 'image' | 'link'
  url: string
  title: string
  addedAt: string
}

export interface Objective {
  id: string
  title: string
  description: string
  deadline: string
  status: Status
  progress: number
  evidence: Evidence[]
  createdAt: string
  updatedAt: string
}

export interface SubCategory {
  id: string
  name: string
  description: string
  order: number
  objectives: Objective[]
}

export interface Category {
  id: string
  name: string
  description: string
  order: number
  subCategories: SubCategory[]
}

export interface UserSettings {
  name: string
  title: string
  department: string
  manager: string
  year: number
  avatar: string
}

export interface MacroGoal {
  title: string
  description: string
}

export interface IDPState {
  categories: Category[]
  settings: UserSettings
  activeYear: number
  macroGoal: MacroGoal
}
