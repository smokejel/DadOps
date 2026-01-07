'use client'

import { useEffect } from 'react'

interface ToastProps {
  message: string
  type?: 'info' | 'success' | 'warning' | 'error'
  duration?: number
  onClose: () => void
}

export default function Toast({
  message,
  type = 'info',
  duration = 3000,
  onClose
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)
    return () => clearTimeout(timer)
  }, [duration, onClose])

  const styles = {
    info: 'bg-blue-500 text-white',
    success: 'bg-green-500 text-white',
    warning: 'bg-amber-500 text-white',
    error: 'bg-red-500 text-white',
  }

  const icons = {
    info: 'info',
    success: 'check_circle',
    warning: 'warning',
    error: 'error',
  }

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-slide-down">
      <div className={`flex items-center gap-3 px-6 py-4 rounded-lg shadow-xl ${styles[type]} max-w-md`}>
        <span className="material-symbols-outlined text-2xl">
          {icons[type]}
        </span>
        <p className="font-medium">{message}</p>
        <button
          onClick={onClose}
          className="ml-2 hover:opacity-70 transition-opacity"
          aria-label="Close"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>
      </div>
    </div>
  )
}
