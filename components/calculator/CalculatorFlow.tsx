'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { encodeCalculatorData } from '@/lib/encoding'
import DueDateStep from './DueDateStep'
import PlanComparisonStep from './PlanComparisonStep'

interface DueDateData {
  month: string
  year: string
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
  const [dueDateData, setDueDateData] = useState<DueDateData>({ month: '', year: '' })
  const [plansData, setPlansData] = useState<Plan[]>([])

  const handleDueDateContinue = (data: DueDateData) => {
    setDueDateData(data)
    setCurrentStep(2)
  }

  const handlePlanComparisonBack = () => {
    setCurrentStep(1)
  }

  const handlePlanComparisonContinue = (plans: Plan[]) => {
    setPlansData(plans)

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
          onBack={handlePlanComparisonBack}
          onContinue={handlePlanComparisonContinue}
        />
      )}
    </>
  )
}
