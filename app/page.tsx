'use client'

import React, { useState } from 'react'
import { Category, SubCategory, Objective } from '@/lib/types'
import { useIDPContext } from './providers'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopNav } from '@/components/layout/TopNav'
import { MobileNav } from '@/components/layout/MobileNav'
import { StatsBar } from '@/components/dashboard/StatsBar'
import { CategorySection } from '@/components/dashboard/CategorySection'
import { ObjectiveModal } from '@/components/goals/ObjectiveModal'
import { CategoryFormModal } from '@/components/categories/CategoryFormModal'
import { Button } from '@/components/ui/Button'
import { Plus, TrendingUp, FolderOpen, Edit3, Trash2 } from 'lucide-react'

// ========================
// Settings View
// ========================
function SettingsView() {
  const { state, updateSettings } = useIDPContext()
  const { settings } = state
  const [form, setForm] = useState(settings)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    updateSettings(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h2 className="text-lg font-bold text-black">Settings</h2>
        <p className="text-sm text-neutral-500">Manage your profile and preferences</p>
      </div>

      <div className="bg-white/60 backdrop-blur-xl p-5 space-y-4 rounded-xl border border-white/40 shadow-sm">
        <h3 className="text-sm font-semibold text-black pb-2 border-b border-black/[0.04]">
          Profile Information
        </h3>

        {[
          { key: 'name', label: 'Full Name', placeholder: 'Your full name' },
          { key: 'title', label: 'Job Title', placeholder: 'e.g. Senior Software Engineer' },
          { key: 'department', label: 'Department', placeholder: 'e.g. Engineering' },
          { key: 'manager', label: "Manager's Name", placeholder: 'Your manager' },
        ].map(({ key, label, placeholder }) => (
          <div key={key}>
            <label className="block text-xs font-semibold mb-1 text-black">{label}</label>
            <input
              type="text"
              value={form[key as keyof typeof form] as string}
              onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
              placeholder={placeholder}
              className="w-full h-8 px-3 text-sm bg-white/50 backdrop-blur-sm border border-black/[0.06] rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>
        ))}

        <div>
          <label className="block text-xs font-semibold mb-1 text-black">IDP Year</label>
          <select
            value={form.year}
            onChange={(e) => setForm((f) => ({ ...f, year: Number(e.target.value) }))}
            className="w-full h-8 px-3 text-sm bg-white/50 backdrop-blur-sm border border-black/[0.06] rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black"
          >
            {[2025, 2026, 2027].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <Button variant="primary" size="md" onClick={handleSave}>
          {saved ? 'Saved!' : 'Save Settings'}
        </Button>
      </div>

      {/* Danger zone */}
      <div className="bg-white/60 backdrop-blur-xl p-5 space-y-3 rounded-xl border border-black/[0.08] shadow-sm">
        <h3 className="text-sm font-semibold text-black">Danger Zone</h3>
        <p className="text-xs text-neutral-500">
          Reset all data and start fresh. This cannot be undone.
        </p>
        <Button
          variant="danger"
          size="sm"
          onClick={() => {
            if (confirm('Reset all IDP data? This cannot be undone.')) {
              localStorage.removeItem('my-idp-data')
              window.location.reload()
            }
          }}
        >
          Reset All Data
        </Button>
      </div>
    </div>
  )
}

// ========================
// Categories Management View
// ========================
function CategoriesView({
  onEditCategory,
  onAddCategory,
  onEditSubCategory,
  onAddSubCategory,
}: {
  onEditCategory: (cat: Category) => void
  onAddCategory: () => void
  onEditSubCategory: (catId: string, sub: SubCategory) => void
  onAddSubCategory: (catId: string) => void
}) {
  const { state, deleteCategory, deleteSubCategory } = useIDPContext()

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-black">Categories</h2>
          <p className="text-sm text-neutral-500">Organize your development objectives</p>
        </div>
        <Button variant="primary" size="md" onClick={onAddCategory}>
          <Plus size={15} />
          Add Category
        </Button>
      </div>

      {state.categories.length === 0 ? (
        <div className="text-center py-16 bg-white/50 backdrop-blur-xl rounded-xl border border-dashed border-black/[0.08]">
          <FolderOpen size={36} className="mx-auto mb-3 text-neutral-300" />
          <h3 className="text-base font-semibold mb-1 text-black">No categories yet</h3>
          <p className="text-sm mb-4 text-neutral-400">
            Create categories to organize your objectives
          </p>
          <Button variant="primary" size="md" onClick={onAddCategory}>
            <Plus size={14} />
            Add Your First Category
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {state.categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white/60 backdrop-blur-xl rounded-xl border border-white/40 shadow-sm overflow-hidden"
            >
              <div className="p-4 flex items-center justify-between border-b border-black/[0.04]">
                <div>
                  <h3 className="text-sm font-bold text-black">{cat.name}</h3>
                  {cat.description && (
                    <p className="text-xs text-neutral-500 mt-0.5">{cat.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onEditCategory(cat)}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-black hover:bg-black/[0.05] transition-all duration-150"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete "${cat.name}"?`)) deleteCategory(cat.id)
                    }}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-black hover:bg-black/[0.05] transition-all duration-150"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-3">
                {cat.subCategories.map((sub) => (
                  <div
                    key={sub.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-white/40 backdrop-blur-sm border border-black/[0.04]"
                  >
                    <div>
                      <p className="text-sm font-medium text-black">{sub.name}</p>
                      {sub.description && (
                        <p className="text-xs text-neutral-400 mt-0.5">{sub.description}</p>
                      )}
                      <p className="text-xs text-neutral-400 mt-1">
                        {sub.objectives.length} objective{sub.objectives.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEditSubCategory(cat.id, sub)}
                        className="p-1 rounded-lg text-neutral-400 hover:text-black hover:bg-black/[0.06] transition-all duration-150"
                      >
                        <Edit3 size={12} />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete "${sub.name}"?`)) deleteSubCategory(cat.id, sub.id)
                        }}
                        className="p-1 rounded-lg text-neutral-400 hover:text-black hover:bg-black/[0.06] transition-all duration-150"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => onAddSubCategory(cat.id)}
                  className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg border border-dashed border-black/[0.08] text-neutral-400 text-xs font-medium hover:border-black/[0.15] hover:text-neutral-600 hover:bg-white/40 transition-all duration-200"
                >
                  <Plus size={12} />
                  Add Sub-Category
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ========================
// Main Page
// ========================
export default function Page() {
  const {
    state,
    stats,
    addCategory,
    updateCategory,
    deleteCategory,
    addSubCategory,
    updateSubCategory,
    deleteSubCategory,
    addObjective,
    deleteObjective,
  } = useIDPContext()

  const [activeSection, setActiveSection] = useState('dashboard')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Objective modal state
  const [editingObjective, setEditingObjective] = useState<Objective | null>(null)
  const [editingLocation, setEditingLocation] = useState<{ catId: string; subCatId: string }>({
    catId: '',
    subCatId: '',
  })
  const [isObjectiveModalOpen, setIsObjectiveModalOpen] = useState(false)

  // Category form state
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  // SubCategory form state
  const [showSubCategoryForm, setShowSubCategoryForm] = useState(false)
  const [editingSubCategory, setEditingSubCategory] = useState<SubCategory | null>(null)
  const [parentCategoryId, setParentCategoryId] = useState('')

  // ── Handlers ──────────────────────────────────────────────────────────

  const handleEditObjective = (catId: string, subCatId: string, objId: string) => {
    const cat = state.categories.find((c) => c.id === catId)
    const sub = cat?.subCategories.find((s) => s.id === subCatId)
    const obj = sub?.objectives.find((o) => o.id === objId)
    if (obj) {
      setEditingObjective(obj)
      setEditingLocation({ catId, subCatId })
      setIsObjectiveModalOpen(true)
    }
  }

  const handleAddObjective = (catId: string, subCatId: string) => {
    const obj = addObjective(catId, subCatId)
    setEditingObjective(obj)
    setEditingLocation({ catId, subCatId })
    setIsObjectiveModalOpen(true)
  }

  const handleCloseObjectiveModal = () => {
    setIsObjectiveModalOpen(false)
    setTimeout(() => setEditingObjective(null), 200)
  }

  // Category handlers
  const handleAddCategory = () => {
    setEditingCategory(null)
    setShowCategoryForm(true)
  }

  const handleEditCategory = (cat: Category) => {
    setEditingCategory(cat)
    setShowCategoryForm(true)
  }

  const handleSaveCategory = (name: string, description: string) => {
    if (editingCategory) {
      updateCategory(editingCategory.id, { name, description })
    } else {
      addCategory({ name, description })
    }
  }

  // SubCategory handlers
  const handleAddSubCategory = (catId: string) => {
    setParentCategoryId(catId)
    setEditingSubCategory(null)
    setShowSubCategoryForm(true)
  }

  const handleEditSubCategoryDashboard = (catId: string, subCatId: string) => {
    const cat = state.categories.find((c) => c.id === catId)
    const sub = cat?.subCategories.find((s) => s.id === subCatId)
    if (sub) {
      setParentCategoryId(catId)
      setEditingSubCategory(sub)
      setShowSubCategoryForm(true)
    }
  }

  const handleEditSubCategoryManagement = (catId: string, sub: SubCategory) => {
    setParentCategoryId(catId)
    setEditingSubCategory(sub)
    setShowSubCategoryForm(true)
  }

  const handleSaveSubCategory = (name: string, description: string) => {
    if (editingSubCategory) {
      updateSubCategory(parentCategoryId, editingSubCategory.id, { name, description })
    } else {
      addSubCategory(parentCategoryId, { name, description })
    }
  }

  return (
    <>
      {/* Sidebar (desktop) */}
      <Sidebar activeSection={activeSection} onNavigate={setActiveSection} />

      {/* Mobile nav */}
      <MobileNav
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        activeSection={activeSection}
        onNavigate={setActiveSection}
      />

      {/* Main layout */}
      <div className="lg:pl-56 min-h-screen flex flex-col">
        <TopNav onMenuOpen={() => setMobileMenuOpen(true)} />

        <main className="flex-1 p-4 lg:p-6 pb-20 lg:pb-6 max-w-[1400px] w-full mx-auto">
          {/* Dashboard */}
          {activeSection === 'dashboard' && (
            <div className="space-y-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h1 className="text-xl font-bold text-black">
                    {state.activeYear} Individual Development Plan
                  </h1>
                  <p className="text-sm mt-0.5 text-neutral-500">
                    {state.settings.name} &middot; {state.settings.title}
                    {state.settings.department ? ` \u00b7 ${state.settings.department}` : ''}
                  </p>
                </div>
                <Button variant="primary" size="md" onClick={handleAddCategory} className="flex-shrink-0">
                  <Plus size={15} />
                  Add Category
                </Button>
              </div>

              <StatsBar stats={stats} />

              {/* Category sections */}
              <div className="space-y-2">
                {state.categories.map((category, i) => (
                  <CategorySection
                    key={category.id}
                    category={category}
                    onAddSubCategory={handleAddSubCategory}
                    onEditCategory={handleEditCategory}
                    onDeleteCategory={(catId) => {
                      deleteCategory(catId)
                    }}
                    onEditSubCategory={handleEditSubCategoryDashboard}
                    onDeleteSubCategory={(catId, subCatId) => {
                      deleteSubCategory(catId, subCatId)
                    }}
                    onEditObjective={handleEditObjective}
                    onDeleteObjective={(catId, subCatId, objId) => {
                      deleteObjective(catId, subCatId, objId)
                    }}
                    onAddObjective={handleAddObjective}
                    defaultExpanded={i < 3}
                  />
                ))}
              </div>

              {state.categories.length === 0 && (
                <div className="text-center py-16 bg-white/50 backdrop-blur-xl rounded-xl border border-dashed border-black/[0.08]">
                  <TrendingUp size={36} className="mx-auto mb-3 text-neutral-300" />
                  <h3 className="text-base font-semibold mb-1 text-black">No categories yet</h3>
                  <p className="text-sm mb-4 text-neutral-400">
                    Start building your {state.activeYear} development plan
                  </p>
                  <Button variant="primary" size="md" onClick={handleAddCategory}>
                    <Plus size={14} />
                    Add Your First Category
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Categories management */}
          {activeSection === 'categories' && (
            <CategoriesView
              onEditCategory={handleEditCategory}
              onAddCategory={handleAddCategory}
              onEditSubCategory={handleEditSubCategoryManagement}
              onAddSubCategory={handleAddSubCategory}
            />
          )}

          {/* Settings */}
          {activeSection === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Objective Modal */}
      <ObjectiveModal
        open={isObjectiveModalOpen}
        objective={editingObjective}
        categoryId={editingLocation.catId}
        subCategoryId={editingLocation.subCatId}
        onClose={handleCloseObjectiveModal}
      />

      {/* Category Form Modal */}
      <CategoryFormModal
        open={showCategoryForm}
        onClose={() => setShowCategoryForm(false)}
        onSave={handleSaveCategory}
        title={editingCategory ? 'Edit Category' : 'New Category'}
        initialName={editingCategory?.name || ''}
        initialDescription={editingCategory?.description || ''}
      />

      {/* SubCategory Form Modal */}
      <CategoryFormModal
        open={showSubCategoryForm}
        onClose={() => setShowSubCategoryForm(false)}
        onSave={handleSaveSubCategory}
        title={editingSubCategory ? 'Edit Sub-Category' : 'New Sub-Category'}
        initialName={editingSubCategory?.name || ''}
        initialDescription={editingSubCategory?.description || ''}
      />
    </>
  )
}
