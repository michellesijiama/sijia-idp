'use client'

import React from 'react'
import { IDPState } from '@/lib/types'
import { formatDate, getDueDateStatus } from '@/lib/utils'
import { Calendar, ExternalLink, Image, Link2, TrendingUp } from 'lucide-react'

interface ReviewViewProps {
  state: IDPState
  stats: {
    total: number
    completed: number
    inProgress: number
    notStarted: number
    avgProgress: number
  }
}

export function ReviewView({ state, stats }: ReviewViewProps) {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 lg:px-0 space-y-12 animate-fade-in">
      {/* Title Slide */}
      <section className="text-center py-16">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-black to-neutral-700 shadow-lg mb-6">
          <TrendingUp size={24} className="text-white" />
        </div>
        <h1 className="text-4xl font-bold text-black tracking-tight mb-2">
          Individual Development Plan
        </h1>
        <p className="text-lg text-neutral-500 mb-1">{state.activeYear}</p>
        <div className="mt-6 space-y-0.5">
          <p className="text-xl font-semibold text-black">{state.settings.name}</p>
          <p className="text-sm text-neutral-500">
            {state.settings.title}
            {state.settings.department ? ` \u00b7 ${state.settings.department}` : ''}
          </p>
          {state.settings.manager && (
            <p className="text-sm text-neutral-400">Manager: {state.settings.manager}</p>
          )}
        </div>
      </section>

      {/* Overview Stats */}
      <section className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-2xl p-8 shadow-sm">
        <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-6">Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Total Objectives', value: stats.total },
            { label: 'Completed', value: stats.completed },
            { label: 'In Progress', value: stats.inProgress },
            { label: 'Not Started', value: stats.notStarted },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-bold text-black">{s.value}</p>
              <p className="text-xs text-neutral-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-neutral-600">Overall Progress</span>
            <span className="text-sm font-bold text-black">{stats.avgProgress}%</span>
          </div>
          <div className="w-full h-3 bg-black/[0.06] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-neutral-800 via-black to-neutral-700 rounded-full transition-all duration-1000"
              style={{ width: `${stats.avgProgress}%` }}
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      {state.categories.map((cat, catIndex) => {
        const catObjectives = cat.subCategories.reduce((sum, s) => sum + s.objectives.length, 0)
        const catProgress = cat.subCategories.reduce(
          (sum, s) => sum + s.objectives.reduce((a, o) => a + o.progress, 0), 0
        )
        const catAvg = catObjectives > 0 ? Math.round(catProgress / catObjectives) : 0

        return (
          <section key={cat.id} className="space-y-6">
            {/* Category header */}
            <div className="border-b-2 border-black pb-3">
              <div className="flex items-baseline justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-1">
                    Category {catIndex + 1}
                  </p>
                  <h2 className="text-2xl font-bold text-black">{cat.name}</h2>
                </div>
                <span className="text-sm font-medium text-neutral-400 flex-shrink-0">
                  {catAvg}% complete
                </span>
              </div>
              {cat.description && (
                <p className="text-sm text-neutral-500 mt-1">{cat.description}</p>
              )}
            </div>

            {/* Sub-categories */}
            {cat.subCategories.map((sub) => (
              <div key={sub.id} className="space-y-4">
                <div className="flex items-baseline gap-3">
                  <h3 className="text-base font-semibold text-black">{sub.name}</h3>
                  {sub.description && (
                    <span className="text-xs text-neutral-400">{sub.description}</span>
                  )}
                </div>

                {/* Objectives */}
                <div className="space-y-4">
                  {sub.objectives.map((obj) => {
                    const dueDateStatus = getDueDateStatus(obj.deadline)
                    return (
                      <div
                        key={obj.id}
                        className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-2xl p-6 shadow-sm"
                      >
                        {/* Header row */}
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-black leading-snug">
                              {obj.title}
                            </h4>
                            {obj.description && (
                              <p className="text-sm text-neutral-500 mt-1.5 leading-relaxed">
                                {obj.description}
                              </p>
                            )}
                          </div>
                          <StatusPill status={obj.status} />
                        </div>

                        {/* Progress */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs text-neutral-400">Progress</span>
                            <span className="text-sm font-bold text-black">{obj.progress}%</span>
                          </div>
                          <div className="w-full h-2 bg-black/[0.06] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-neutral-800 via-black to-neutral-700 rounded-full"
                              style={{ width: `${obj.progress}%` }}
                            />
                          </div>
                        </div>

                        {/* Deadline */}
                        <div className="flex items-center gap-2 mb-4">
                          <Calendar size={14} className="text-neutral-400" />
                          <span className={`text-sm ${
                            dueDateStatus === 'overdue'
                              ? 'text-black font-semibold'
                              : dueDateStatus === 'soon'
                              ? 'text-neutral-600 font-medium'
                              : 'text-neutral-500'
                          }`}>
                            {dueDateStatus === 'overdue' ? 'Overdue \u00b7 ' : ''}
                            Due {formatDate(obj.deadline)}
                          </span>
                        </div>

                        {/* Evidence */}
                        {obj.evidence.length > 0 && (
                          <div className="border-t border-black/[0.04] pt-4">
                            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-3">
                              Evidence ({obj.evidence.length})
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                              {obj.evidence.map((ev) => (
                                <a
                                  key={ev.id}
                                  href={ev.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2.5 p-2.5 rounded-lg bg-white/40 border border-black/[0.04] hover:bg-white/70 hover:shadow-sm transition-all duration-150 group"
                                >
                                  {ev.type === 'image' ? (
                                    <div className="w-10 h-10 rounded-md bg-black/[0.03] flex-shrink-0 overflow-hidden">
                                      {/* eslint-disable-next-line @next/next/no-img-element */}
                                      <img
                                        src={ev.url}
                                        alt={ev.title}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                          (e.target as HTMLImageElement).style.display = 'none'
                                        }}
                                      />
                                    </div>
                                  ) : (
                                    <div className="w-10 h-10 rounded-md bg-black/[0.03] flex-shrink-0 flex items-center justify-center">
                                      <Link2 size={14} className="text-neutral-400" />
                                    </div>
                                  )}
                                  <div className="min-w-0 flex-1">
                                    <p className="text-xs font-medium text-black truncate">{ev.title}</p>
                                    <p className="text-[10px] text-neutral-400">{formatDate(ev.addedAt)}</p>
                                  </div>
                                  <ExternalLink size={12} className="text-neutral-300 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </section>
        )
      })}

      {/* Footer */}
      <section className="text-center py-12 border-t border-black/[0.06]">
        <p className="text-xs text-neutral-400">
          {state.settings.name} &middot; {state.activeYear} Individual Development Plan
        </p>
      </section>
    </div>
  )
}

function StatusPill({ status }: { status: string }) {
  const styles = {
    'Completed': 'bg-black text-white',
    'In Progress': 'bg-white/60 border border-black/20 text-black',
    'Not Started': 'bg-white/40 border border-black/[0.08] text-neutral-500',
  }[status] || 'bg-white/40 border border-black/[0.08] text-neutral-500'

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${styles}`}>
      {status}
    </span>
  )
}
