'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDashboardState } from '@/hooks/useDashboardState'
import { formatDueDate, formatCurrency } from '@/lib/dashboardUtils'
import { NUMBER_TO_MONTH, MONTH_NAMES } from '@/lib/constants'

export default function SettingsPage() {
  const router = useRouter()
  const { userData, setUserData, resetAllData } = useDashboardState()
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [editingDueDate, setEditingDueDate] = useState(false)
  const [editingInsurance, setEditingInsurance] = useState(false)

  // Due date form state
  const [dueDateMonth, setDueDateMonth] = useState(userData?.dueDate.month || 1)
  const [dueDateYear, setDueDateYear] = useState(userData?.dueDate.year || new Date().getFullYear() + 1)
  const [dueDateDay, setDueDateDay] = useState(userData?.dueDate.day || 15)

  // Insurance form state
  const [planName, setPlanName] = useState(userData?.insurance.planName || '')
  const [monthlyPremium, setMonthlyPremium] = useState(userData?.insurance.monthlyPremium.toString() || '')
  const [familyDeductible, setFamilyDeductible] = useState(userData?.insurance.familyDeductible.toString() || '')
  const [familyOopMax, setFamilyOopMax] = useState(userData?.insurance.familyOopMax.toString() || '')
  const [employerHsa, setEmployerHsa] = useState(userData?.insurance.employerHsa.toString() || '')

  if (!userData) return null

  const handleSaveDueDate = () => {
    setUserData({
      ...userData,
      dueDate: {
        month: dueDateMonth,
        year: dueDateYear,
        day: dueDateDay,
      },
    })
    setEditingDueDate(false)
  }

  const handleSaveInsurance = () => {
    setUserData({
      ...userData,
      insurance: {
        planName: planName || 'My Plan',
        monthlyPremium: parseFloat(monthlyPremium) || 0,
        familyDeductible: parseFloat(familyDeductible) || 0,
        familyOopMax: parseFloat(familyOopMax) || 0,
        employerHsa: parseFloat(employerHsa) || 0,
      },
    })
    setEditingInsurance(false)
  }

  const handleReset = () => {
    resetAllData()
    router.push('/onboarding')
  }

  const currentYear = new Date().getFullYear()
  const years = [currentYear, currentYear + 1, currentYear + 2]

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-gray-400 mt-1">
          Manage your profile and preferences.
        </p>
      </div>

      {/* Due Date Section */}
      <div className="bg-card-dark rounded-xl border border-gray-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">event</span>
            Due Date
          </h2>
          {!editingDueDate && (
            <button
              onClick={() => setEditingDueDate(true)}
              className="text-primary hover:text-primary-dark transition-colors"
            >
              <span className="material-symbols-outlined">edit</span>
            </button>
          )}
        </div>

        {editingDueDate ? (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Month</label>
                <select
                  value={dueDateMonth}
                  onChange={(e) => setDueDateMonth(parseInt(e.target.value))}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                >
                  {MONTH_NAMES.map((name, index) => (
                    <option key={name} value={index + 1}>{name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Day</label>
                <input
                  type="number"
                  min={1}
                  max={31}
                  value={dueDateDay}
                  onChange={(e) => setDueDateDay(parseInt(e.target.value) || 1)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Year</label>
                <select
                  value={dueDateYear}
                  onChange={(e) => setDueDateYear(parseInt(e.target.value))}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                >
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setEditingDueDate(false)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveDueDate}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <p className="text-2xl text-white">{formatDueDate(userData.dueDate)}</p>
        )}
      </div>

      {/* Insurance Section */}
      <div className="bg-card-dark rounded-xl border border-gray-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-400">medical_services</span>
            Insurance Details
          </h2>
          {!editingInsurance && (
            <button
              onClick={() => setEditingInsurance(true)}
              className="text-primary hover:text-primary-dark transition-colors"
            >
              <span className="material-symbols-outlined">edit</span>
            </button>
          )}
        </div>

        {editingInsurance ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Plan Name</label>
              <input
                type="text"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Monthly Premium</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                  <input
                    type="number"
                    value={monthlyPremium}
                    onChange={(e) => setMonthlyPremium(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-8 pr-4 py-2 text-white focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Family Deductible</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                  <input
                    type="number"
                    value={familyDeductible}
                    onChange={(e) => setFamilyDeductible(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-8 pr-4 py-2 text-white focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Family OOP Max</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                  <input
                    type="number"
                    value={familyOopMax}
                    onChange={(e) => setFamilyOopMax(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-8 pr-4 py-2 text-white focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Employer HSA/HRA</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                  <input
                    type="number"
                    value={employerHsa}
                    onChange={(e) => setEmployerHsa(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-8 pr-4 py-2 text-white focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setEditingInsurance(false)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveInsurance}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400">Plan Name</p>
              <p className="text-white">{userData.insurance.planName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Monthly Premium</p>
              <p className="text-white">{formatCurrency(userData.insurance.monthlyPremium)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Family Deductible</p>
              <p className="text-white">{formatCurrency(userData.insurance.familyDeductible)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Family OOP Max</p>
              <p className="text-white">{formatCurrency(userData.insurance.familyOopMax)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Employer HSA/HRA</p>
              <p className="text-white">{formatCurrency(userData.insurance.employerHsa)}</p>
            </div>
          </div>
        )}
      </div>

      {/* Danger Zone */}
      <div className="bg-card-dark rounded-xl border border-red-900/50 p-6">
        <h2 className="text-lg font-semibold text-red-400 flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined">warning</span>
          Danger Zone
        </h2>

        {showResetConfirm ? (
          <div className="space-y-4">
            <p className="text-gray-300">
              This will permanently delete all your data including tasks, budget items, and settings.
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Yes, Delete Everything
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-4 py-2 border border-red-600 text-red-400 rounded-lg hover:bg-red-600/10 transition-colors"
          >
            Reset All Data
          </button>
        )}
      </div>
    </div>
  )
}
