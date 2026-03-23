'use client'

import React, { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'

interface CategoryFormModalProps {
  open: boolean
  onClose: () => void
  onSave: (name: string, description: string) => void
  title: string
  initialName?: string
  initialDescription?: string
}

export function CategoryFormModal({
  open,
  onClose,
  onSave,
  title,
  initialName = '',
  initialDescription = '',
}: CategoryFormModalProps) {
  const [name, setName] = useState(initialName)
  const [description, setDescription] = useState(initialDescription)

  useEffect(() => {
    setName(initialName)
    setDescription(initialDescription)
  }, [initialName, initialDescription, open])

  const handleSave = () => {
    if (!name.trim()) return
    onSave(name.trim(), description.trim())
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <div className="p-5 space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">
            Name <span className="text-neutral-400">*</span>
          </label>
          <input
            autoFocus
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name..."
            className="w-full h-10 px-3 text-base text-black border border-black/[0.06] rounded-none bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent placeholder:text-neutral-400"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleSave()
              }
            }}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">
            Description <span className="text-xs text-neutral-400">(optional)</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description..."
            rows={2}
            className="w-full px-3 py-2 text-base text-black border border-black/[0.06] rounded-none bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent placeholder:text-neutral-400 resize-none"
          />
        </div>
        <div className="flex items-center justify-end gap-2 pt-2">
          <Button variant="secondary" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="md" onClick={handleSave} disabled={!name.trim()}>
            Save
          </Button>
        </div>
      </div>
    </Modal>
  )
}
