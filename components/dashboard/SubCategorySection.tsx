'use client'

import React from 'react'
import { SubCategory } from '@/lib/types'
import { ObjectiveCard } from './ObjectiveCard'
import { Plus, Edit3, Trash2 } from 'lucide-react'

interface SubCategorySectionProps {
  catId: string
  subCategory: SubCategory
  onEditSubCategory: (catId: string, subCatId: string) => void
  onDeleteSubCategory: (catId: string, subCatId: string) => void
  onEditObjective: (catId: string, subCatId: string, objId: string) => void
  onDeleteObjective: (catId: string, subCatId: string, objId: string) => void
  onAddObjective: (catId: string, subCatId: string) => void
}

export function SubCategorySection({
  catId,
  subCategory,
  onEditSubCategory,
  onDeleteSubCategory,
  onEditObjective,
  onDeleteObjective,
  onAddObjective,
}: SubCategorySectionProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-base font-semibold text-black">{subCategory.name}</h3>
        {subCategory.description && (
          <span className="text-sm text-neutral-400 hidden sm:inline">{subCategory.description}</span>
        )}
        <div className="flex items-center gap-0.5 ml-auto flex-shrink-0">
          <button
            onClick={() => onEditSubCategory(catId, subCategory.id)}
            className="p-1 rounded-lg text-neutral-400 hover:text-black hover:bg-black/[0.05] transition-all duration-150"
            title="Edit sub-category"
          >
            <Edit3 size={12} />
          </button>
          <button
            onClick={() => {
              if (confirm(`Delete "${subCategory.name}" and all its objectives?`)) {
                onDeleteSubCategory(catId, subCategory.id)
              }
            }}
            className="p-1 rounded-lg text-neutral-400 hover:text-black hover:bg-black/[0.05] transition-all duration-150"
            title="Delete sub-category"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {subCategory.objectives.map((obj) => (
          <ObjectiveCard
            key={obj.id}
            objective={obj}
            onEdit={() => onEditObjective(catId, subCategory.id, obj.id)}
            onDelete={() => {
              if (confirm(`Delete "${obj.title}"?`)) {
                onDeleteObjective(catId, subCategory.id, obj.id)
              }
            }}
          />
        ))}

        {/* Add objective card */}
        <button
          onClick={() => onAddObjective(catId, subCategory.id)}
          className="flex flex-col items-center justify-center gap-2 min-h-[120px] rounded-xl border-2 border-dashed border-black/[0.08] text-neutral-400 hover:border-black/[0.15] hover:text-neutral-600 hover:bg-white/40 hover:backdrop-blur-sm transition-all duration-200"
        >
          <Plus size={20} />
          <span className="text-sm font-medium">Add objective</span>
        </button>
      </div>
    </div>
  )
}
