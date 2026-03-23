'use client'

import { useState, useCallback, useMemo } from 'react'
import {
  IDPState,
  Category,
  SubCategory,
  Objective,
  Evidence,
  UserSettings,
} from '@/lib/types'
import {
  saveState,
  createCategory,
  createSubCategory,
  createObjective,
  createEvidence,
} from '@/lib/store'

// ── helpers for deeply nested immutable updates ──────────────────────────────

function updateCategories(
  categories: Category[],
  catId: string,
  updater: (cat: Category) => Category
): Category[] {
  return categories.map((cat) => (cat.id === catId ? updater(cat) : cat))
}

function updateSubCategories(
  subCategories: SubCategory[],
  subCatId: string,
  updater: (sub: SubCategory) => SubCategory
): SubCategory[] {
  return subCategories.map((sub) => (sub.id === subCatId ? updater(sub) : sub))
}

function updateObjectives(
  objectives: Objective[],
  objId: string,
  updater: (obj: Objective) => Objective
): Objective[] {
  return objectives.map((obj) => (obj.id === objId ? updater(obj) : obj))
}

// ── hook ─────────────────────────────────────────────────────────────────────

export function useIDP(
  initialState: IDPState,
  onSave?: (state: IDPState) => void
) {
  const [state, setState] = useState<IDPState>(initialState)

  const persist = useCallback(
    (newState: IDPState) => {
      setState(newState)
      saveState(newState)
      onSave?.(newState)
    },
    [onSave]
  )

  // ── Category CRUD ────────────────────────────────────────────────────────

  const addCategory = useCallback(
    (partial: Partial<Category> = {}) => {
      const cat = createCategory({
        order: state.categories.length,
        ...partial,
      })
      persist({ ...state, categories: [...state.categories, cat] })
      return cat
    },
    [state, persist]
  )

  const updateCategory = useCallback(
    (catId: string, updates: Partial<Category>) => {
      const categories = updateCategories(state.categories, catId, (cat) => ({
        ...cat,
        ...updates,
      }))
      persist({ ...state, categories })
    },
    [state, persist]
  )

  const deleteCategory = useCallback(
    (catId: string) => {
      const categories = state.categories.filter((c) => c.id !== catId)
      persist({ ...state, categories })
    },
    [state, persist]
  )

  // ── SubCategory CRUD ────────────────────────────────────────────────────

  const addSubCategory = useCallback(
    (catId: string, partial: Partial<SubCategory> = {}) => {
      const categories = updateCategories(state.categories, catId, (cat) => {
        const sub = createSubCategory({
          order: cat.subCategories.length,
          ...partial,
        })
        return { ...cat, subCategories: [...cat.subCategories, sub] }
      })
      persist({ ...state, categories })
    },
    [state, persist]
  )

  const updateSubCategory = useCallback(
    (catId: string, subCatId: string, updates: Partial<SubCategory>) => {
      const categories = updateCategories(state.categories, catId, (cat) => ({
        ...cat,
        subCategories: updateSubCategories(cat.subCategories, subCatId, (sub) => ({
          ...sub,
          ...updates,
        })),
      }))
      persist({ ...state, categories })
    },
    [state, persist]
  )

  const deleteSubCategory = useCallback(
    (catId: string, subCatId: string) => {
      const categories = updateCategories(state.categories, catId, (cat) => ({
        ...cat,
        subCategories: cat.subCategories.filter((s) => s.id !== subCatId),
      }))
      persist({ ...state, categories })
    },
    [state, persist]
  )

  // ── Objective CRUD ──────────────────────────────────────────────────────

  const addObjective = useCallback(
    (catId: string, subCatId: string, partial: Partial<Objective> = {}) => {
      const obj = createObjective(partial)
      const categories = updateCategories(state.categories, catId, (cat) => ({
        ...cat,
        subCategories: updateSubCategories(cat.subCategories, subCatId, (sub) => ({
          ...sub,
          objectives: [...sub.objectives, obj],
        })),
      }))
      persist({ ...state, categories })
      return obj
    },
    [state, persist]
  )

  const updateObjective = useCallback(
    (catId: string, subCatId: string, objId: string, updates: Partial<Objective>) => {
      const now = new Date().toISOString()
      const categories = updateCategories(state.categories, catId, (cat) => ({
        ...cat,
        subCategories: updateSubCategories(cat.subCategories, subCatId, (sub) => ({
          ...sub,
          objectives: updateObjectives(sub.objectives, objId, (obj) => ({
            ...obj,
            ...updates,
            updatedAt: now,
          })),
        })),
      }))
      persist({ ...state, categories })
    },
    [state, persist]
  )

  const deleteObjective = useCallback(
    (catId: string, subCatId: string, objId: string) => {
      const categories = updateCategories(state.categories, catId, (cat) => ({
        ...cat,
        subCategories: updateSubCategories(cat.subCategories, subCatId, (sub) => ({
          ...sub,
          objectives: sub.objectives.filter((o) => o.id !== objId),
        })),
      }))
      persist({ ...state, categories })
    },
    [state, persist]
  )

  // ── Evidence CRUD ───────────────────────────────────────────────────────

  const addEvidence = useCallback(
    (
      catId: string,
      subCatId: string,
      objId: string,
      type: 'image' | 'link',
      url: string,
      title: string
    ) => {
      const ev = createEvidence(type, url, title)
      const now = new Date().toISOString()
      const categories = updateCategories(state.categories, catId, (cat) => ({
        ...cat,
        subCategories: updateSubCategories(cat.subCategories, subCatId, (sub) => ({
          ...sub,
          objectives: updateObjectives(sub.objectives, objId, (obj) => ({
            ...obj,
            evidence: [...obj.evidence, ev],
            updatedAt: now,
          })),
        })),
      }))
      persist({ ...state, categories })
    },
    [state, persist]
  )

  const deleteEvidence = useCallback(
    (catId: string, subCatId: string, objId: string, evidenceId: string) => {
      const now = new Date().toISOString()
      const categories = updateCategories(state.categories, catId, (cat) => ({
        ...cat,
        subCategories: updateSubCategories(cat.subCategories, subCatId, (sub) => ({
          ...sub,
          objectives: updateObjectives(sub.objectives, objId, (obj) => ({
            ...obj,
            evidence: obj.evidence.filter((e) => e.id !== evidenceId),
            updatedAt: now,
          })),
        })),
      }))
      persist({ ...state, categories })
    },
    [state, persist]
  )

  // ── Reorder ────────────────────────────────────────────────────────────

  const reorderCategories = useCallback(
    (newCategories: Category[]) => {
      persist({ ...state, categories: newCategories })
    },
    [state, persist]
  )

  // ── Settings ────────────────────────────────────────────────────────────

  const updateSettings = useCallback(
    (updates: Partial<UserSettings>) => {
      persist({ ...state, settings: { ...state.settings, ...updates } })
    },
    [state, persist]
  )

  const setActiveYear = useCallback(
    (year: number) => {
      persist({ ...state, activeYear: year })
    },
    [state, persist]
  )

  // ── Computed ────────────────────────────────────────────────────────────

  const allObjectives = useMemo(() => {
    const objs: Objective[] = []
    for (const cat of state.categories) {
      for (const sub of cat.subCategories) {
        for (const obj of sub.objectives) {
          objs.push(obj)
        }
      }
    }
    return objs
  }, [state.categories])

  const stats = useMemo(() => {
    const total = allObjectives.length
    const completed = allObjectives.filter((o) => o.status === 'Completed').length
    const inProgress = allObjectives.filter((o) => o.status === 'In Progress').length
    const notStarted = allObjectives.filter((o) => o.status === 'Not Started').length
    const avgProgress =
      total > 0
        ? Math.round(allObjectives.reduce((sum, o) => sum + o.progress, 0) / total)
        : 0
    return { total, completed, inProgress, notStarted, avgProgress }
  }, [allObjectives])

  return {
    state,
    allObjectives,
    stats,
    addCategory,
    updateCategory,
    deleteCategory,
    reorderCategories,
    addSubCategory,
    updateSubCategory,
    deleteSubCategory,
    addObjective,
    updateObjective,
    deleteObjective,
    addEvidence,
    deleteEvidence,
    updateSettings,
    setActiveYear,
  }
}
