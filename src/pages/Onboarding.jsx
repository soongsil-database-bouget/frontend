import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
    </svg>
  )
}

export default function Onboarding() {
  const navigate = useNavigate()

  const categories = useMemo(
    () => [
      'Prototyping', 'Sketch', 'Product', 'Figma', 'UI kit',
      'User experience', 'Wireframing', 'XD', 'Leadership',
      'UI design', 'ReactJS', 'Photoshop'
    ],
    []
  )

  const refineDefaults = useMemo(
    () => [
      'Top Rated', 'Men', 'Black', 'Red', 'Green', 'Blue',
      'Turquoise', 'Shoes', 'Watches', 'Apparel', 'Shirt', 'On Sale'
    ],
    []
  )

  const [selectedCats, setSelectedCats] = useState(new Set(['Prototyping', 'Figma', 'ReactJS']))
  const [refine, setRefine] = useState(refineDefaults)

  const toggleCategory = (label) => {
    const next = new Set(selectedCats)
    if (next.has(label)) next.delete(label)
    else next.add(label)
    setSelectedCats(next)
  }

  const selectAll = () => setSelectedCats(new Set(categories))
  const clearAllRefine = () => setRefine([])

  const removeRefine = (label) => {
    setRefine((prev) => prev.filter((x) => x !== label))
  }

  const finish = () => {
    const chosen = Array.from(selectedCats)
    localStorage.setItem('onboardingTags', JSON.stringify({ categories: chosen, refine }))
    navigate('/', { replace: true })
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-md mx-auto px-5 py-6">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-lg font-extrabold">Filter by category</h1>
          <button type="button" className="text-sm text-gray-500 hover:text-gray-700 inline-flex items-center gap-1">
            <span>Styles</span>
            <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7 10l5 5 5-5z"/></svg>
          </button>
        </div>
        <p className="text-xs text-gray-500 mb-3">128 chips discovered</p>

        <div className="flex flex-wrap gap-2">
          {categories.map((c) => {
            const active = selectedCats.has(c)
            return (
              <button
                key={c}
                type="button"
                onClick={() => toggleCategory(c)}
                className={`h-8 px-3 rounded-full border text-sm transition
                  ${active ? 'border-blue-400 text-blue-700 bg-blue-50' : 'border-gray-200 text-gray-700 bg-white hover:bg-gray-50'}`}
              >
                <span className="inline-flex items-center gap-1">
                  {active && <CheckIcon />}
                  {c}
                </span>
              </button>
            )
          })}
        </div>

        <div className="mt-3">
          <button
            type="button"
            onClick={selectAll}
            className="h-9 px-3 rounded-md bg-gray-100 text-gray-700 text-sm font-medium"
          >
            Select All
          </button>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-extrabold">Refine results</h2>
          <p className="text-xs text-gray-500 mt-1">Closeable 칩스</p>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {refine.map((r) => (
            <span
              key={r}
              className="inline-flex items-center gap-2 h-8 px-3 rounded-full border border-gray-200 text-gray-700 bg-white text-sm"
            >
              {r}
              <button
                type="button"
                aria-label={`${r} 제거`}
                className="text-gray-400 hover:text-gray-600"
                onClick={() => removeRefine(r)}
              >
                <CloseIcon />
              </button>
            </span>
          ))}
        </div>

        <div className="mt-3">
          <button
            type="button"
            onClick={clearAllRefine}
            className="h-9 px-3 rounded-md bg-orange-100 text-orange-800 text-sm font-semibold"
          >
            Clear All
          </button>
        </div>

        <div className="h-10" />

        <div className="sticky bottom-4">
          <button
            type="button"
            onClick={finish}
            className="w-full h-12 rounded-xl bg-pink-500 text-white font-bold shadow"
          >
            완료
          </button>
        </div>
      </div>
    </div>
  )
}

