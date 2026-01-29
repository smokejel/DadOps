'use client'

interface ViewToggleProps {
  view: 'trimester' | 'category'
  onChange: (view: 'trimester' | 'category') => void
}

export default function ViewToggle({ view, onChange }: ViewToggleProps) {
  return (
    <div className="inline-flex rounded-lg bg-gray-800 p-1">
      <button
        onClick={() => onChange('trimester')}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
          view === 'trimester'
            ? 'bg-gray-700 text-white'
            : 'text-gray-400 hover:text-white'
        }`}
      >
        By Trimester
      </button>
      <button
        onClick={() => onChange('category')}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
          view === 'category'
            ? 'bg-gray-700 text-white'
            : 'text-gray-400 hover:text-white'
        }`}
      >
        By Category
      </button>
    </div>
  )
}
