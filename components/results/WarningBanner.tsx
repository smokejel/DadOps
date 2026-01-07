interface WarningBannerProps {
  type: 'double-deductible' | 'info'
  title: string
  message: string
}

export default function WarningBanner({ type, title, message }: WarningBannerProps) {
  const isWarning = type === 'double-deductible'

  return (
    <div
      className={`flex flex-col sm:flex-row gap-4 p-6 rounded-xl border-2 ${
        isWarning
          ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
          : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
      }`}
    >
      {/* Icon */}
      <div className="flex-shrink-0">
        <div
          className={`flex items-center justify-center w-12 h-12 rounded-full ${
            isWarning
              ? 'bg-amber-100 dark:bg-amber-900/40'
              : 'bg-blue-100 dark:bg-blue-900/40'
          }`}
        >
          <span
            className={`material-symbols-outlined text-2xl ${
              isWarning
                ? 'text-amber-600 dark:text-amber-400'
                : 'text-blue-600 dark:text-blue-400'
            }`}
          >
            {isWarning ? 'warning' : 'info'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">
        <h3
          className={`text-lg font-bold mb-1 ${
            isWarning
              ? 'text-amber-900 dark:text-amber-200'
              : 'text-blue-900 dark:text-blue-200'
          }`}
        >
          {title}
        </h3>
        <p
          className={`text-base ${
            isWarning
              ? 'text-amber-800 dark:text-amber-300'
              : 'text-blue-800 dark:text-blue-300'
          }`}
        >
          {message}
        </p>
      </div>
    </div>
  )
}
