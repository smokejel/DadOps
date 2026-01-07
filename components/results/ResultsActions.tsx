'use client'

import { useState } from 'react'

export default function ResultsActions() {
  const [shareTooltip, setShareTooltip] = useState(false)

  const handlePrint = () => {
    window.print()
  }

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setShareTooltip(true)
      setTimeout(() => setShareTooltip(false), 2000)
    } catch (error) {
      console.error('Failed to copy link:', error)
    }
  }

  return (
    <div className="flex flex-wrap gap-3 justify-center print:hidden">
      {/* Print Button */}
      <button
        onClick={handlePrint}
        className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
      >
        <span className="material-symbols-outlined text-xl">print</span>
        <span>Print Results</span>
      </button>

      {/* Share Button */}
      <button
        onClick={handleShare}
        className="relative flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
      >
        <span className="material-symbols-outlined text-xl">share</span>
        <span>Share Link</span>
        {shareTooltip && (
          <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm px-3 py-1.5 rounded shadow-lg whitespace-nowrap">
            ✓ Copied!
          </span>
        )}
      </button>

      {/* Start Over Button */}
      <a
        href="/"
        className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
      >
        <span className="material-symbols-outlined text-xl">refresh</span>
        <span>Start Over</span>
      </a>
    </div>
  )
}
