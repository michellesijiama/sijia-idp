'use client'

import React from 'react'
import { IDPState } from '@/lib/types'
import { formatDate } from '@/lib/utils'
import { Avatar } from '@/components/ui/Avatar'
import { Calendar, ExternalLink, Link2 } from 'lucide-react'

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
        <div className="inline-flex mb-6">
          <Avatar avatar={state.settings.avatar} name={state.settings.name} size="lg" />
        </div>
        <h1 className="text-4xl font-bold text-black tracking-tight mb-2">
          Individual Development Plan
        </h1>
        <div className="mt-6 space-y-0.5">
          <p className="text-xl font-semibold text-black">{state.settings.name}</p>
          <p className="text-base text-neutral-500">
            {state.settings.title}
            {state.settings.department ? ` \u00b7 ${state.settings.department}` : ''}
          </p>
          {state.settings.manager && (
            <p className="text-base text-neutral-400">Manager: {state.settings.manager}</p>
          )}
        </div>
      </section>

      {/* Macro Goal */}
      {(state.macroGoal.title || state.macroGoal.description) && (
        <section className="py-8 border-b border-black/[0.06]">
          <p className="text-base font-semibold text-neutral-400 uppercase tracking-widest mb-2">
            Macro Goal
          </p>
          {state.macroGoal.title && (
            <h2 className="text-2xl font-bold text-black mb-2">{state.macroGoal.title}</h2>
          )}
          {state.macroGoal.description && (
            <p className="text-base text-neutral-500 leading-relaxed whitespace-pre-line">{state.macroGoal.description}</p>
          )}
        </section>
      )}

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
                  <p className="text-base font-semibold text-neutral-400 uppercase tracking-widest mb-1">
                    Category {catIndex + 1}
                  </p>
                  <h2 className="text-2xl font-bold text-black">{cat.name}</h2>
                </div>
                <span className="text-base font-medium text-neutral-400 flex-shrink-0">
                  {catObjectives} objective{catObjectives !== 1 ? 's' : ''}
                </span>
              </div>
              {cat.description && (
                <p className="text-base text-neutral-500 mt-1">{cat.description}</p>
              )}
            </div>

            {/* Sub-categories */}
            {cat.subCategories.map((sub) => (
              <div key={sub.id} className="space-y-4">
                <div className="flex items-baseline gap-3">
                  <h3 className="text-lg font-semibold text-black">{sub.name}</h3>
                  {sub.description && (
                    <span className="text-base text-neutral-400">{sub.description}</span>
                  )}
                </div>

                {/* Objectives */}
                <div className="space-y-4">
                  {sub.objectives.map((obj) => {
                    const imageEvidence = obj.evidence.filter((e) => e.type === 'image')
                    const linkEvidence = obj.evidence.filter((e) => e.type === 'link')

                    return (
                      <div
                        key={obj.id}
                        className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-none shadow-sm"
                      >
                        <div className={`flex ${imageEvidence.length > 0 ? 'flex-col md:flex-row' : ''}`}>
                          {/* Image thumbnails — left column */}
                          {imageEvidence.length > 0 && (
                            <div className="md:w-48 lg:w-56 flex-shrink-0 bg-neutral-50 border-b md:border-b-0 md:border-r border-black/[0.04] p-3">
                              <div className={`${imageEvidence.length === 1 ? '' : 'grid grid-cols-2 md:grid-cols-1 gap-2'}`}>
                                {imageEvidence.map((ev) => (
                                  <div key={ev.id} className="overflow-hidden rounded-none">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                      src={ev.url}
                                      alt={ev.title}
                                      className="w-full h-32 md:h-40 object-cover"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none'
                                      }}
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Text content — right column */}
                          <div className="flex-1 p-6">
                            {/* Header */}
                            <div className="flex items-start justify-between gap-4 mb-3">
                              <h4 className="text-lg font-semibold text-black leading-snug">
                                {obj.title}
                              </h4>
                              <StatusPill status={obj.status} />
                            </div>

                            {obj.description && (
                              <p className="text-base text-neutral-500 mb-3 leading-relaxed">
                                {obj.description}
                              </p>
                            )}

                            {/* Deadline */}
                            <div className="flex items-center gap-2 mb-3">
                              <Calendar size={14} className="text-neutral-400" />
                              <span className="text-base text-neutral-500">
                                Due {formatDate(obj.deadline)}
                              </span>
                            </div>

                            {/* Link evidence */}
                            {linkEvidence.length > 0 && (
                              <div className="border-t border-black/[0.04] pt-3 mt-3">
                                <div className="space-y-1.5">
                                  {linkEvidence.map((ev) => (
                                    <a
                                      key={ev.id}
                                      href={ev.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-2 text-base text-neutral-500 hover:text-black transition-colors group"
                                    >
                                      <Link2 size={14} className="text-neutral-400 flex-shrink-0" />
                                      <span className="truncate">{ev.title}</span>
                                      <ExternalLink size={12} className="text-neutral-300 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
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
        <p className="text-base text-neutral-400">
          {state.settings.name} &middot; Individual Development Plan
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
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-base font-semibold flex-shrink-0 ${styles}`}>
      {status}
    </span>
  )
}
