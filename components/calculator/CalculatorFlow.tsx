'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { encodeCalculatorData } from '@/lib/encoding'
import { trackCalculatorStarted, trackCalculatorCompleted, trackModeSelected } from '@/lib/analytics'
import DueDateStep, { CalculatorMode } from './DueDateStep'
import PlanComparisonStep from './PlanComparisonStep'

interface DueDateData {
  month: string
  year: string
  mode: CalculatorMode
}

interface Plan {
  name: string
  monthlyPremium: string
  familyDeductible: string
  familyOopMax: string
  employerHsa: string
}

export default function CalculatorFlow() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [dueDateData, setDueDateData] = useState<DueDateData>({ month: '', year: '', mode: 'compare' })
  const [plansData, setPlansData] = useState<Plan[]>([])

  const handleDueDateContinue = (data: DueDateData) => {
    setDueDateData(data)
    setCurrentStep(2)

    // Track calculator started (user progressed to plan input step)
    trackCalculatorStarted()

    // Track mode selection
    trackModeSelected({ mode: data.mode })
  }

  const handlePlanComparisonBack = () => {
    setCurrentStep(1)
  }

  const handlePlanComparisonContinue = (plans: Plan[]) => {
    setPlansData(plans)

    // Track calculator completed
    trackCalculatorCompleted({
      due_month: parseInt(dueDateData.month),
      due_year: parseInt(dueDateData.year),
      num_plans: plans.length,
    })

    // Encode data and navigate to results page
    try {
      const token = encodeCalculatorData(
        dueDateData.month,
        dueDateData.year,
        plans
      )

      // Navigate to teaser results page
      router.push(`/results?token=${token}&preview=true`)
    } catch (error) {
      console.error('Encoding error:', error)
      alert('An error occurred while processing your data. Please try again.')
    }
  }

  return (
    <>
      {currentStep === 1 && (
        <DueDateStep onContinue={handleDueDateContinue} />
      )}
      {currentStep === 2 && (
        <PlanComparisonStep
          mode={dueDateData.mode}
          onBack={handlePlanComparisonBack}
          onContinue={handlePlanComparisonContinue}
        />
      )}
    </>
  )
}
