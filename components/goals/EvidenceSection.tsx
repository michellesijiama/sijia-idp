'use client'

import React, { useState } from 'react'
import { Evidence } from '@/lib/types'
import { formatDate } from '@/lib/utils'
import { Plus, Trash2, ExternalLink, Image, Link2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface EvidenceSectionProps {
  evidence: Evidence[]
  onAdd: (type: 'image' | 'link', url: string, title: string) => void
  onDelete: (id: string) => void
}

export function EvidenceSection({ evidence, onAdd, onDelete }: EvidenceSectionProps) {
  const [adding, setAdding] = useState<'image' | 'link' | null>(null)
  const [newUrl, setNewUrl] = useState('')
  const [newTitle, setNewTitle] = useState('')

  const handleAdd = () => {
    if (!adding || !newUrl.trim() || !newTitle.trim()) return
    onAdd(adding, newUrl.trim(), newTitle.trim())
    setNewUrl('')
    setNewTitle('')
    setAdding(null)
  }

  const handleCancel = () => {
    setAdding(null)
    setNewUrl('')
    setNewTitle('')
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-neutral-700">Evidence</label>
        {!adding && (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAdding('image')}
              className="text-neutral-500"
            >
              <Image size={13} />
              Image
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAdding('link')}
              className="text-neutral-500"
            >
              <Link2 size={13} />
              Link
            </Button>
          </div>
        )}
      </div>

      {/* Add form */}
      {adding && (
        <div className="border border-black/10 rounded-xl p-3 space-y-2 animate-slide-up bg-white/50 backdrop-blur-sm">
          <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">
            Add {adding}
          </p>
          <input
            autoFocus
            type="url"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder={adding === 'image' ? 'Image URL...' : 'Link URL...'}
            className="w-full h-8 px-3 text-sm border border-black/[0.06] rounded-lg bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent placeholder:text-neutral-400 text-black"
          />
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Title..."
            className="w-full h-8 px-3 text-sm border border-black/[0.06] rounded-lg bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent placeholder:text-neutral-400 text-black"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleAdd()
              }
            }}
          />
          <div className="flex items-center justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleAdd}
              disabled={!newUrl.trim() || !newTitle.trim()}
            >
              Add
            </Button>
          </div>
        </div>
      )}

      {/* Evidence cards */}
      {evidence.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {evidence.map((ev) => (
            <div
              key={ev.id}
              className="border border-white/40 rounded-xl overflow-hidden bg-white/50 backdrop-blur-sm group hover:bg-white/70 hover:shadow-md transition-all duration-200"
            >
              {ev.type === 'image' ? (
                <div className="h-24 bg-black/[0.03] relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={ev.url}
                    alt={ev.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      const parent = target.parentElement
                      if (parent) {
                        parent.classList.add('flex', 'items-center', 'justify-center')
                        const span = document.createElement('span')
                        span.className = 'text-xs text-neutral-400'
                        span.textContent = 'Image unavailable'
                        parent.appendChild(span)
                      }
                    }}
                  />
                </div>
              ) : (
                <div className="h-24 bg-black/[0.02] flex items-center justify-center">
                  <ExternalLink size={24} className="text-neutral-300" />
                </div>
              )}
              <div className="p-2.5 flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-black truncate">{ev.title}</p>
                  <p className="text-[10px] text-neutral-400 mt-0.5">
                    {formatDate(ev.addedAt)}
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (confirm('Delete this evidence?')) onDelete(ev.id)
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded text-neutral-400 hover:text-black flex-shrink-0"
                  aria-label="Delete evidence"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : !adding ? (
        <div className="py-6 text-center border border-dashed border-black/[0.08] rounded-xl">
          <Link2 size={20} className="mx-auto mb-1.5 text-neutral-300" />
          <p className="text-xs text-neutral-400">No evidence yet. Add images or links.</p>
        </div>
      ) : null}
    </div>
  )
}
