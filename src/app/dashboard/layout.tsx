'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useDashboardState } from '@/hooks/useDashboardState'
import Sidebar from '@/components/dashboard/Sidebar'
import MobileNav from '@/components/dashboard/MobileNav'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { isLoaded, isOnboarded } = useDashboardState()

  useEffect(() => {
    if (isLoaded && !isOnboarded) {
      router.push('/onboarding')
    }
  }, [isLoaded, isOnboarded, router])

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-400">Loading mission data...</span>
        </div>
      </div>
    )
  }

  if (!isOnboarded) {
    return null
  }

  return (
    <div className="flex min-h-screen bg-background-dark">
      <Sidebar />
      <main className="flex-1 pb-20 md:pb-0 overflow-y-auto">
        {children}
      </main>
      <MobileNav />
    </div>
  )
}
