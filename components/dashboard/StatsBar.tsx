'use client'

import React from 'react'

interface StatsBarProps {
  stats: {
    total: number
    completed: number
    inProgress: number
    notStarted: number
    avgProgress: number
  }
}

export function StatsBar({ stats }: StatsBarProps) {
  const cards = [
    { label: 'Total Objectives', value: stats.total },
    { label: 'Completed', value: stats.completed },
    { label: 'In Progress', value: stats.inProgress },
    { label: 'Not Started', value: stats.notStarted },
  ]

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-none p-4 animate-slide-up shadow-sm hover:bg-white/75 hover:shadow-md transition-all duration-200"
          >
            <p className="text-2xl font-bold text-black leading-none">{card.value}</p>
            <p className="text-base text-neutral-500 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-none p-4 animate-slide-up shadow-sm flex items-center justify-between">
        <span className="text-base text-neutral-500">
          {stats.completed} of {stats.total} objectives completed
        </span>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-base font-bold bg-black text-white">
          {stats.avgProgress}% Overall
        </span>
      </div>
    </div>
  )
}
