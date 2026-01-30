'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useDashboardState } from '@/hooks/useDashboardState'
import Sidebar from '@/components/dashboard/Sidebar'
import MobileNav from '@/components/dashboard/MobileNav'
import { LoadingSpinner } from '@/components/ui'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { isLoaded, isOnboarded } = useDashboardState()

  useEffect(() => {
    if (isLoaded && !isOnboarded) {
      router.push('/onboarding')
    }
  }, [isLoaded, isOnboarded, router])

  if (!isLoaded) {
    return <LoadingSpinner showLogo message="Loading mission data..." />
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
