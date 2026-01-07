'use client'

import { FullResults as FullResultsType } from '@/lib/calculations'
import DashboardLayout from '../dashboard/DashboardLayout'

interface FullResultsProps {
  results: FullResultsType
}

export default function FullResults({ results }: FullResultsProps) {
  return <DashboardLayout results={results} />
}
