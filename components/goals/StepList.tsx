'use client'

import React, { useState, useRef } from 'react'
import { Step } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface StepListProps {
  steps: Step[]
  onAdd: (text: string) => void
  onToggle: (id: string) => void
  onUpdate: (id: string, updates: Partial<Step>) => void
  onDelete: (id: string) => void
}

export function StepList({ steps, onAdd, onToggle, onUpdate, onDelete }: StepListProps) {
  const [newText, setNewText] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleAdd = () => {
    const text = newText.trim()
    if (!text) return
    onAdd(text)
    setNewText('')
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAdd()
    }
  }

  const completed = steps.filter((s) => s.completed).length

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-neutral-700">Steps</label>
        {steps.length > 0 && (
          <span className="text-xs text-neutral-400">
            {completed}/{steps.length} done
          </span>
        )}
      </div>

      {steps.length > 0 && (
        <div className="space-y-1.5">
          {steps.map((step) => (
            <div
              key={step.id}
              className={cn(
                'flex items-start gap-2.5 p-2.5 rounded-md group transition-colors duration-100',
                step.completed ? 'bg-black/[0.02]' : 'bg-white/50 backdrop-blur-sm border border-black/[0.06]'
              )}
            >
              <div className="flex-shrink-0 mt-0.5">
                <button
                  onClick={() => onToggle(step.id)}
                  className={cn(
                    'w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-150',
                    step.completed
                      ? 'bg-black border-black'
                      : 'border-neutral-300 hover:border-black'
                  )}
                  aria-label={step.completed ? 'Mark as incomplete' : 'Mark as complete'}
                >
                  {step.completed && (
                    <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                      <path
                        d="M1 3L3 5L7 1"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              </div>

              <span
                className={cn(
                  'flex-1 text-sm leading-relaxed',
                  step.completed ? 'text-neutral-400 line-through' : 'text-neutral-700'
                )}
              >
                {step.text}
              </span>

              <button
                onClick={() => onDelete(step.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-100 p-0.5 rounded text-neutral-400 hover:text-black"
                aria-label="Delete step"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add new */}
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="text"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a step..."
          className="flex-1 h-8 px-3 text-sm border border-black/[0.06] rounded-lg bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent placeholder:text-neutral-400 text-black"
        />
        <Button variant="secondary" size="sm" onClick={handleAdd} disabled={!newText.trim()}>
          <Plus size={14} />
          Add
        </Button>
      </div>
    </div>
  )
}
