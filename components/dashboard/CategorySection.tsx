'use client'

import React, { useState } from 'react'
import { Category } from '@/lib/types'
import { SubCategorySection } from './SubCategorySection'
import { ChevronDown, ChevronRight, Plus, Edit3, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface CategorySectionProps {
  category: Category
  onAddSubCategory: (catId: string) => void
  onEditCategory: (cat: Category) => void
  onDeleteCategory: (catId: string) => void
  onEditSubCategory: (catId: string, subCatId: string) => void
  onDeleteSubCategory: (catId: string, subCatId: string) => void
  onEditObjective: (catId: string, subCatId: string, objId: string) => void
  onDeleteObjective: (catId: string, subCatId: string, objId: string) => void
  onAddObjective: (catId: string, subCatId: string) => void
  defaultExpanded?: boolean
}

export function CategorySection({
  category,
  onAddSubCategory,
  onEditCategory,
  onDeleteCategory,
  onEditSubCategory,
  onDeleteSubCategory,
  onEditObjective,
  onDeleteObjective,
  onAddObjective,
  defaultExpanded = true,
}: CategorySectionProps) {
  const [expanded, setExpanded] = useState(defaultExpanded)

  const totalObjectives = category.subCategories.reduce(
    (sum, sub) => sum + sub.objectives.length,
    0
  )
  const totalProgress = category.subCategories.reduce(
    (sum, sub) =>
      sum + sub.objectives.reduce((s, obj) => s + obj.progress, 0),
    0
  )
  const avgProgress = totalObjectives > 0 ? Math.round(totalProgress / totalObjectives) : 0

  return (
    <div className="animate-slide-up">
      <div className="flex items-center gap-3 py-3 border-b border-black/10">
        <button
          onClick={() => setExpanded((e) => !e)}
          className="flex items-center gap-3 flex-1 min-w-0 group"
        >
          <div className="text-neutral-400 group-hover:text-black transition-colors">
            {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </div>
          <h2 className="font-bold text-base text-black truncate">
            {category.name}
          </h2>
          <span className="text-sm text-neutral-400 font-normal flex-shrink-0">
            {totalObjectives} objective{totalObjectives !== 1 ? 's' : ''} &middot; {avgProgress}% complete
          </span>
        </button>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => onEditCategory(category)}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-black hover:bg-black/[0.05] transition-all duration-150"
            title="Edit category"
          >
            <Edit3 size={14} />
          </button>
          <button
            onClick={() => {
              if (confirm(`Delete "${category.name}" and all its contents?`)) {
                onDeleteCategory(category.id)
              }
            }}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-black hover:bg-black/[0.05] transition-all duration-150"
            title="Delete category"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="pl-4 py-4 space-y-6">
          {category.subCategories.map((sub) => (
            <SubCategorySection
              key={sub.id}
              catId={category.id}
              subCategory={sub}
              onEditSubCategory={onEditSubCategory}
              onDeleteSubCategory={onDeleteSubCategory}
              onEditObjective={onEditObjective}
              onDeleteObjective={onDeleteObjective}
              onAddObjective={onAddObjective}
            />
          ))}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAddSubCategory(category.id)}
            className="text-neutral-400 hover:text-black"
          >
            <Plus size={14} />
            Add Sub-Category
          </Button>
        </div>
      )}
    </div>
  )
}
