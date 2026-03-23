'use client'

import React from 'react'
import { Objective } from '@/lib/types'
import { formatDate, getDueDateStatus } from '@/lib/utils'
import { StatusBadge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Button } from '@/components/ui/Button'
import { Calendar, Edit3, Trash2 } from 'lucide-react'

interface ObjectiveCardProps {
  objective: Objective
  onEdit: () => void
  onDelete: () => void
}

export function ObjectiveCard({ objective, onEdit, onDelete }: ObjectiveCardProps) {
  const dueDateStatus = getDueDateStatus(objective.deadline)
  const totalEvidence = objective.evidence.length

  return (
    <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-xl p-4 animate-slide-up transition-all duration-200 hover:bg-white/80 hover:shadow-lg hover:border-white/60 group">
      {/* Status */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <StatusBadge status={objective.status} />
      </div>

      {/* Title */}
      <h3
        className="text-sm font-semibold text-black leading-snug mb-2 cursor-pointer hover:underline"
        onClick={onEdit}
      >
        {objective.title}
      </h3>

      {/* Description preview */}
      {objective.description && (
        <p className="text-xs text-neutral-500 mb-3 line-clamp-2 leading-relaxed">
          {objective.description}
        </p>
      )}

      {/* Progress */}
      <div className="mb-3">
        <ProgressBar value={objective.progress} showLabel size="md" animated />
      </div>

      {/* Due date */}
      <div className="flex items-center gap-1.5 mb-3">
        <Calendar size={12} className="text-neutral-400 flex-shrink-0" />
        <span
          className={`text-xs ${
            dueDateStatus === 'overdue'
              ? 'text-black font-semibold'
              : dueDateStatus === 'soon'
              ? 'text-neutral-600 font-medium'
              : 'text-neutral-400'
          }`}
        >
          {dueDateStatus === 'overdue' ? 'Overdue \u00b7 ' : ''}
          Due {formatDate(objective.deadline)}
        </span>
      </div>

      {/* Info line */}
      {totalEvidence > 0 && (
        <p className="text-xs text-neutral-400 mb-3">
          {totalEvidence} evidence
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center gap-1.5 pt-2 border-t border-black/[0.04]">
        <Button variant="primary" size="sm" onClick={onEdit} className="flex-1">
          <Edit3 size={12} />
          Edit
        </Button>
        <Button variant="ghost" size="icon" onClick={onDelete} title="Delete">
          <Trash2 size={13} />
        </Button>
      </div>
    </div>
  )
}
