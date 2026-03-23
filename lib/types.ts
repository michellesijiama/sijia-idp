export type Status = 'Not Started' | 'In Progress' | 'Completed'
export const STATUSES: Status[] = ['Not Started', 'In Progress', 'Completed']

export interface Step {
  id: string
  text: string
  completed: boolean
}

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
  steps: Step[]
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
}

export interface IDPState {
  categories: Category[]
  settings: UserSettings
  activeYear: number
}
