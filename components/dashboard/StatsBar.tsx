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
            className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-xl p-4 animate-slide-up shadow-sm hover:bg-white/75 hover:shadow-md transition-all duration-200"
          >
            <p className="text-2xl font-bold text-black leading-none">{card.value}</p>
            <p className="text-xs text-neutral-500 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-xl p-4 animate-slide-up shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-black">Overall Progress</span>
          <span className="text-sm font-bold text-black">{stats.avgProgress}%</span>
        </div>
        <div className="w-full h-2 bg-black/[0.06] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-neutral-800 via-black to-neutral-700 rounded-full"
            style={{
              width: `${stats.avgProgress}%`,
              transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
        </div>
        <div className="flex items-center gap-4 mt-2">
          <span className="text-xs text-neutral-400">
            {stats.completed} of {stats.total} objectives completed
          </span>
          {stats.total > 0 && (
            <span className="text-xs text-neutral-400">
              {Math.round((stats.completed / stats.total) * 100)}% completion rate
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
