'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Status } from '@/lib/types'

interface BadgeProps {
  children: React.ReactNode
  className?: string
}

export function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center bg-white/50 backdrop-blur-sm border border-black/[0.06] text-neutral-600 rounded-full px-2.5 py-0.5 text-base font-medium',
        className
      )}
    >
      {children}
    </span>
  )
}

export function StatusBadge({ status }: { status: Status }) {
  const dotClass = {
    'Not Started': 'border border-neutral-300 bg-transparent',
    'In Progress': 'border-2 border-black bg-transparent',
    Completed: 'bg-gradient-to-br from-black to-neutral-600',
  }[status]

  return (
    <span className="inline-flex items-center gap-1.5 text-base font-medium text-neutral-600 bg-white/40 backdrop-blur-sm px-2.5 py-0.5 rounded-full border border-black/[0.04]">
      <span className={cn('w-2.5 h-2.5 rounded-full inline-block flex-shrink-0', dotClass)} aria-hidden="true" />
      {status}
    </span>
  )
}
