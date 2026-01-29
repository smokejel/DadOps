'use client'

import { useDashboardState } from '@/hooks/useDashboardState'
import { calculateCosts, calculateTotalBudget } from '@/lib/dashboardUtils'
import CountdownCard from '@/components/dashboard/CountdownCard'
import StatsCards from '@/components/dashboard/StatsCards'
import MissionIntelligence from '@/components/dashboard/MissionIntelligence'
import CostBreakdown from '@/components/dashboard/CostBreakdown'
import WarChestGauge from '@/components/dashboard/WarChestGauge'
import UpcomingTasks from '@/components/dashboard/UpcomingTasks'

export default function DashboardPage() {
  const { userData, tasks, budget, toggleTask, updateCashOnHand } = useDashboardState()

  if (!userData || !tasks || !budget) {
    return null
  }

  const costs = calculateCosts(userData)
  const totalBudget = calculateTotalBudget(budget)

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Countdown / Mission Status */}
      <CountdownCard userData={userData} tasks={tasks} />

      {/* Stats Row */}
      <StatsCards costs={costs} totalBudget={totalBudget} />

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MissionIntelligence userData={userData} />
        <CostBreakdown costs={costs} userData={userData} />
      </div>

      {/* War Chest Gauge */}
      <WarChestGauge
        costs={costs}
        cashOnHand={userData.cashOnHand || 0}
        onUpdateCash={updateCashOnHand}
      />

      {/* Upcoming Tasks */}
      <UpcomingTasks tasks={tasks} onToggleTask={toggleTask} />
    </div>
  )
}
