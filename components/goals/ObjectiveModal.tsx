'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Objective, STATUSES } from '@/lib/types'
import { formatDateTime } from '@/lib/utils'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { ProgressSlider } from './ProgressSlider'
import { EvidenceSection } from './EvidenceSection'
import { useIDPContext } from '@/app/providers'
import { Save, Clock } from 'lucide-react'

interface ObjectiveModalProps {
  open: boolean
  objective: Objective | null
  categoryId: string
  subCategoryId: string
  onClose: () => void
}

export function ObjectiveModal({
  open,
  objective,
  categoryId,
  subCategoryId,
  onClose,
}: ObjectiveModalProps) {
  const {
    state,
    updateObjective,
    addEvidence,
    deleteEvidence,
  } = useIDPContext()

  const [form, setForm] = useState<Partial<Objective>>({})
  const [isDirty, setIsDirty] = useState(false)

  // Get the live objective from global state so evidence updates are reflected
  const liveObjective = useMemo(() => {
    if (!objective) return null
    for (const cat of state.categories) {
      if (cat.id !== categoryId) continue
      for (const sub of cat.subCategories) {
        if (sub.id !== subCategoryId) continue
        return sub.objectives.find((o) => o.id === objective.id) ?? null
      }
    }
    return null
  }, [state.categories, categoryId, subCategoryId, objective])

  useEffect(() => {
    if (objective) {
      setForm({ ...objective })
      setIsDirty(false)
    }
  }, [objective])

  if (!objective || !liveObjective) return null

  // Merge form edits (title, description, etc.) with live evidence from global state
  const currentObj = { ...liveObjective, ...form, evidence: liveObjective.evidence } as Objective

  const set = <K extends keyof Objective>(key: K, value: Objective[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setIsDirty(true)
  }

  const handleSave = () => {
    if (!objective) return
    // Don't include evidence in form updates — it's managed directly via addEvidence/deleteEvidence
    const { evidence, ...formWithoutEvidence } = form
    updateObjective(categoryId, subCategoryId, objective.id, formWithoutEvidence)
    setIsDirty(false)
    onClose()
  }

  const handleClose = () => {
    if (isDirty) {
      if (confirm('You have unsaved changes. Close without saving?')) {
        onClose()
      }
    } else {
      onClose()
    }
  }

  return (
    <Modal open={open} onClose={handleClose} size="xl">
      <div className="flex flex-col">
        {/* Custom header */}
        <div className="px-5 pt-5 pb-4 border-b border-black/[0.05]">
          <input
            type="text"
            value={currentObj.title}
            onChange={(e) => set('title', e.target.value)}
            className="w-full text-lg font-bold text-black bg-transparent border-none outline-none focus:ring-0 placeholder:text-neutral-300/60 mb-2"
            placeholder="Objective title..."
          />
          <div className="flex items-center gap-2 flex-wrap">
            {/* Status selector */}
            <div className="flex items-center gap-1 bg-black/[0.03] backdrop-blur-sm border border-black/[0.06] rounded-full p-0.5">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => set('status', s)}
                  className={`px-2.5 py-1 text-base font-medium rounded-full transition-all duration-150 ${
                    currentObj.status === s
                      ? 'bg-gradient-to-b from-neutral-800 to-black text-white shadow-sm'
                      : 'text-neutral-500 hover:bg-white/60'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Last updated */}
            <div className="flex items-center gap-1 text-base text-neutral-400 ml-auto">
              <Clock size={12} />
              Updated {formatDateTime(liveObjective.updatedAt)}
            </div>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-5 space-y-6">
            {/* Description */}
            <div>
              <label className="block text-base font-medium text-neutral-700 mb-1.5">
                Description
              </label>
              <textarea
                value={currentObj.description}
                onChange={(e) => set('description', e.target.value)}
                placeholder="Describe this objective in detail..."
                rows={3}
                className="w-full px-3 py-2 text-base text-black border border-black/[0.06] rounded-none bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent placeholder:text-neutral-400 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Deadline */}
              <div>
                <label className="block text-base font-medium text-neutral-700 mb-1.5">
                  Deadline
                </label>
                <input
                  type="date"
                  value={currentObj.deadline}
                  onChange={(e) => set('deadline', e.target.value)}
                  className="h-10 px-3 text-base text-black border border-black/[0.06] rounded-none bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent w-full"
                />
              </div>

              {/* Progress slider */}
              <ProgressSlider
                value={currentObj.progress}
                onChange={(v) => set('progress', v)}
              />
            </div>

            {/* Evidence section */}
            <div className="border-t border-black/[0.04] pt-5">
              <EvidenceSection
                evidence={currentObj.evidence}
                onAdd={(type, url, title) => {
                  addEvidence(categoryId, subCategoryId, liveObjective.id, type, url, title)
                  setIsDirty(true)
                }}
                onDelete={(evidenceId) => {
                  deleteEvidence(categoryId, subCategoryId, liveObjective.id, evidenceId)
                  setIsDirty(true)
                }}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-black/[0.05] flex items-center justify-end gap-2 bg-white/40 backdrop-blur-sm flex-shrink-0">
          <Button variant="secondary" size="md" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" size="md" onClick={handleSave} disabled={!isDirty}>
            <Save size={14} />
            Save Changes
          </Button>
        </div>
      </div>
    </Modal>
  )
}
