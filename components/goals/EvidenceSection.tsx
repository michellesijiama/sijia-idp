'use client'

import React, { useState, useRef } from 'react'
import { Evidence } from '@/lib/types'
import { formatDate } from '@/lib/utils'
import { Trash2, ExternalLink, Image, Link2, Upload, Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface EvidenceSectionProps {
  evidence: Evidence[]
  onAdd: (type: 'image' | 'link', url: string, title: string) => void
  onDelete: (id: string) => void
}

function resizeImage(file: File, maxWidth: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const img = document.createElement('img')
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let { width, height } = img
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width)
          width = maxWidth
        }
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) { reject(new Error('No canvas context')); return }
        ctx.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', 0.8))
      }
      img.onerror = reject
      img.src = reader.result as string
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export function EvidenceSection({ evidence, onAdd, onDelete }: EvidenceSectionProps) {
  const [linkUrl, setLinkUrl] = useState('')
  const [linkTitle, setLinkTitle] = useState('')
  const [showLinkForm, setShowLinkForm] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const dataUrl = await resizeImage(file, 1200)
      const title = file.name.replace(/\.[^/.]+$/, '')
      onAdd('image', dataUrl, title)
    } catch (err) {
      console.error('Failed to process image:', err)
      alert('Failed to process image. Please try again.')
    }
    setUploading(false)
    // Reset input so same file can be selected again
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleAddLink = () => {
    if (!linkUrl.trim() || !linkTitle.trim()) return
    onAdd('link', linkUrl.trim(), linkTitle.trim())
    setLinkUrl('')
    setLinkTitle('')
    setShowLinkForm(false)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-neutral-700">Evidence</label>
        <span className="text-xs text-neutral-400">{evidence.length} item{evidence.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Always-visible add buttons */}
      <div className="flex items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
        <Button
          variant="secondary"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex-1"
        >
          {uploading ? (
            <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <Upload size={13} />
          )}
          {uploading ? 'Uploading...' : 'Attach Image'}
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setShowLinkForm(!showLinkForm)}
          className="flex-1"
        >
          <Link2 size={13} />
          Add Link
        </Button>
      </div>

      {/* Link form */}
      {showLinkForm && (
        <div className="border border-black/10 rounded-none p-3 space-y-2 animate-slide-up bg-white/50 backdrop-blur-sm">
          <input
            autoFocus
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="Paste URL..."
            className="w-full h-10 px-3 text-base border border-black/[0.06] rounded-none bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent placeholder:text-neutral-400 text-black"
          />
          <input
            type="text"
            value={linkTitle}
            onChange={(e) => setLinkTitle(e.target.value)}
            placeholder="Title for this link..."
            className="w-full h-10 px-3 text-base border border-black/[0.06] rounded-none bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent placeholder:text-neutral-400 text-black"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleAddLink()
              }
            }}
          />
          <div className="flex items-center justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => { setShowLinkForm(false); setLinkUrl(''); setLinkTitle('') }}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleAddLink}
              disabled={!linkUrl.trim() || !linkTitle.trim()}
            >
              <Plus size={13} />
              Add
            </Button>
          </div>
        </div>
      )}

      {/* Evidence grid */}
      {evidence.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {evidence.map((ev) => (
            <div
              key={ev.id}
              className="border border-white/40 rounded-none overflow-hidden bg-white/50 backdrop-blur-sm group hover:bg-white/70 hover:shadow-md transition-all duration-200"
            >
              {ev.type === 'image' ? (
                <a href={ev.url} target="_blank" rel="noopener noreferrer" className="block h-32 bg-black/[0.03] relative cursor-pointer">
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
                </a>
              ) : (
                <a
                  href={ev.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-20 bg-black/[0.02] flex items-center justify-center hover:bg-black/[0.04] transition-colors"
                >
                  <ExternalLink size={24} className="text-neutral-300" />
                </a>
              )}
              <div className="p-2.5 flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-black truncate">{ev.title}</p>
                  <p className="text-[10px] text-neutral-400 mt-0.5">
                    {ev.type === 'image' ? <Image size={9} className="inline mr-0.5 -mt-px" /> : <Link2 size={9} className="inline mr-0.5 -mt-px" />}
                    {ev.type} &middot; {formatDate(ev.addedAt)}
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (confirm('Delete this evidence?')) onDelete(ev.id)
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity w-7 h-7 flex items-center justify-center rounded-none text-neutral-400 hover:text-black hover:bg-black/[0.05] flex-shrink-0"
                  aria-label="Delete evidence"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-8 text-center border border-dashed border-black/[0.08] rounded-none">
          <Image size={24} className="mx-auto mb-2 text-neutral-300" />
          <p className="text-xs text-neutral-400">No evidence yet.</p>
          <p className="text-xs text-neutral-400">Attach images or add links above.</p>
        </div>
      )}
    </div>
  )
}
