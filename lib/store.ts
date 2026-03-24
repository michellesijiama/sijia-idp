import { Category, SubCategory, Objective, Evidence, IDPState } from './types'
import { SAMPLE_STATE } from './data'

const STORAGE_KEY = 'my-idp-data'

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function createCategory(partial: Partial<Category> = {}): Category {
  return {
    id: generateId(),
    name: 'New Category',
    description: '',
    order: 0,
    subCategories: [],
    ...partial,
  }
}

export function createSubCategory(partial: Partial<SubCategory> = {}): SubCategory {
  return {
    id: generateId(),
    name: 'New Sub-Category',
    description: '',
    order: 0,
    objectives: [],
    ...partial,
  }
}

export function createObjective(partial: Partial<Objective> = {}): Objective {
  const now = new Date().toISOString()
  return {
    id: generateId(),
    title: 'New Objective',
    description: '',
    deadline: new Date(new Date().getFullYear(), 11, 31).toISOString().split('T')[0],
    status: 'Not Started',
    progress: 0,
    evidence: [],
    createdAt: now,
    updatedAt: now,
    ...partial,
  }
}

export function createEvidence(type: 'image' | 'link', url: string, title: string): Evidence {
  return {
    id: generateId(),
    type,
    url,
    title,
    addedAt: new Date().toISOString(),
  }
}

export function loadState(): IDPState {
  if (typeof window === 'undefined') {
    return SAMPLE_STATE
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      const initial = SAMPLE_STATE
      saveState(initial)
      return initial
    }
    const parsed = JSON.parse(raw)

    // Migration: if old format with goals array, convert to new format
    if (parsed.goals && !parsed.categories) {
      const migrated = migrateFromOldFormat(parsed)
      saveState(migrated)
      return migrated
    }

    // Ensure macroGoal exists for data saved before this field was added
    if (!parsed.macroGoal) {
      parsed.macroGoal = { title: '', description: '' }
    }

    return parsed as IDPState
  } catch {
    return SAMPLE_STATE
  }
}

function migrateFromOldFormat(old: {
  goals?: Array<{
    id: string
    title: string
    category: string
    description: string
    status: string
    progress: number
    dueDate: string
    milestones?: Array<{ id: string; text: string; completed: boolean }>
    evidenceNotes?: Array<{ id: string; content: string; createdAt: string }>
    createdAt: string
    updatedAt: string
  }>
  settings?: {
    name: string
    title: string
    department: string
    manager: string
    year: number
    avatar?: string
  }
  activeYear?: number
  macroGoal?: { title: string; description: string }
}): IDPState {
  const goals = old.goals || []
  const categoryMap = new Map<string, Category>()

  goals.forEach((goal, idx) => {
    const catName = goal.category || 'General'
    if (!categoryMap.has(catName)) {
      categoryMap.set(catName, {
        id: generateId(),
        name: catName,
        description: '',
        order: categoryMap.size,
        subCategories: [
          {
            id: generateId(),
            name: 'General',
            description: '',
            order: 0,
            objectives: [],
          },
        ],
      })
    }

    const cat = categoryMap.get(catName)!
    const sub = cat.subCategories[0]

    const objective: Objective = {
      id: goal.id,
      title: goal.title,
      description: goal.description || '',
      deadline: goal.dueDate || '',
      status: (goal.status as Objective['status']) || 'Not Started',
      progress: goal.progress || 0,
      evidence: (goal.evidenceNotes || []).map((n) => ({
        id: n.id,
        type: 'link' as const,
        url: '',
        title: n.content.slice(0, 80),
        addedAt: n.createdAt,
      })),
      createdAt: goal.createdAt,
      updatedAt: goal.updatedAt,
    }

    sub.objectives.push(objective)
  })

  return {
    categories: Array.from(categoryMap.values()),
    settings: old.settings
      ? {
          name: old.settings.name,
          title: old.settings.title,
          department: old.settings.department,
          manager: old.settings.manager,
          year: old.settings.year,
          avatar: old.settings.avatar || '',
        }
      : SAMPLE_STATE.settings,
    activeYear: old.activeYear || SAMPLE_STATE.activeYear,
    macroGoal: old.macroGoal || { title: '', description: '' },
  }
}

export function saveState(state: IDPState): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    console.warn('Failed to save IDP state to localStorage')
  }
}

export function clearState(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
}
