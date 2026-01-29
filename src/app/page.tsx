'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useDashboardState } from '@/hooks/useDashboardState'

export default function HomePage() {
  const router = useRouter()
  const { isLoaded, isOnboarded } = useDashboardState()

  useEffect(() => {
    if (isLoaded) {
      if (isOnboarded) {
        router.push('/dashboard')
      } else {
        router.push('/onboarding')
      }
    }
  }, [isLoaded, isOnboarded, router])

  return (
    <div className="min-h-screen bg-background-dark flex items-center justify-center">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-gray-400">Initializing mission control...</span>
      </div>
    </div>
  )
}
