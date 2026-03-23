'use client'

import React from 'react'
import { Objective } from '@/lib/types'
import { formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { Calendar, Edit3, Trash2 } from 'lucide-react'

interface ObjectiveCardProps {
  objective: Objective
  onEdit: () => void
  onDelete: () => void
}

export function ObjectiveCard({ objective, onEdit, onDelete }: ObjectiveCardProps) {
  const totalEvidence = objective.evidence.length

  return (
    <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-none p-4 animate-slide-up transition-all duration-200 hover:bg-white/80 hover:shadow-lg hover:border-white/60 group">
      {/* Status + Progress */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="inline-flex items-center gap-1.5 text-base font-semibold bg-white/40 backdrop-blur-sm px-2.5 py-0.5 rounded-full border border-black/[0.04] text-black">
          {objective.status} · {objective.progress}%
        </span>
      </div>

      {/* Title */}
      <h3
        className="text-base font-semibold text-black leading-snug mb-2 cursor-pointer hover:underline"
        onClick={onEdit}
      >
        {objective.title}
      </h3>

      {/* Description preview */}
      {objective.description && (
        <p className="text-base text-neutral-500 mb-3 line-clamp-2 leading-relaxed">
          {objective.description}
        </p>
      )}

      {/* Due date */}
      <div className="flex items-center gap-1.5 mb-3">
        <Calendar size={14} className="text-neutral-400 flex-shrink-0" />
        <span className="text-base text-neutral-400">
          Due {formatDate(objective.deadline)}
        </span>
      </div>

      {/* Info line */}
      {totalEvidence > 0 && (
        <p className="text-base text-neutral-400 mb-3">
          {totalEvidence} evidence
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center gap-1.5 pt-2 border-t border-black/[0.04]">
        <Button variant="primary" size="sm" onClick={onEdit} className="flex-1">
          <Edit3 size={14} />
          Edit
        </Button>
        <Button variant="ghost" size="icon" onClick={onDelete} title="Delete" aria-label="Delete objective">
          <Trash2 size={14} />
        </Button>
      </div>
    </div>
  )
}
