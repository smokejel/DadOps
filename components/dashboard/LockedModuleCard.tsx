'use client'

interface LockedModuleCardProps {
  title: string
  description: string
  icon: string
  comingSoon?: boolean
  onClick: () => void
}

export default function LockedModuleCard({
  title,
  description,
  icon,
  comingSoon = true,
  onClick,
}: LockedModuleCardProps) {
  return (
    <div
      onClick={onClick}
      className="relative bg-white dark:bg-surface-dark rounded-xl border-2 border-gray-200 dark:border-gray-700 p-6 cursor-pointer hover:border-gray-300 dark:hover:border-gray-600 transition-all hover:shadow-lg overflow-hidden"
    >
      {/* Soon Badge */}
      {comingSoon && (
        <div className="absolute top-4 right-4">
          <span className="inline-block bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
            Soon
          </span>
        </div>
      )}

      {/* Icon */}
      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
        <span className="material-symbols-outlined text-gray-500 dark:text-gray-400 text-3xl">
          {icon}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>

      {/* Description */}
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        {description}
      </p>

      {/* Blurred Preview Content (Placeholder) */}
      <div className="relative mb-4">
        <div className="space-y-2 opacity-40">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
        </div>
        <div className="absolute inset-0 backdrop-blur-sm"></div>
      </div>

      {/* Coming Soon Badge */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <span className="material-symbols-outlined text-lg">schedule</span>
          <span>Coming Q2 2026</span>
        </div>
      </div>
    </div>
  )
}
