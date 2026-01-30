'use client'

import { useLocalStorage } from './useLocalStorage'
import { UserData, Task, BudgetCategory } from '@/lib/types'
import { STORAGE_KEYS } from '@/lib/storage'
import { DEFAULT_TASKS } from '@/lib/defaultTasks'
import { DEFAULT_BUDGET_CATEGORIES } from '@/lib/defaultBudget'

export function useDashboardState() {
  const [userData, setUserData, userLoaded] = useLocalStorage<UserData | null>(
    STORAGE_KEYS.user,
    null
  )
  const [tasks, setTasks, tasksLoaded] = useLocalStorage<Task[] | null>(
    STORAGE_KEYS.tasks,
    null
  )
  const [budget, setBudget, budgetLoaded] = useLocalStorage<BudgetCategory[] | null>(
    STORAGE_KEYS.budget,
    null
  )

  const isLoaded = userLoaded && tasksLoaded && budgetLoaded
  const isOnboarded = userData !== null

  // Initialize with defaults when user completes onboarding
  const initializeUser = (user: UserData, calculatedCosts: { annualPremium: number; expectedOop: number; employerHsa: number }) => {
    setUserData(user)

    // Initialize tasks if not already set
    if (!tasks) {
      setTasks(DEFAULT_TASKS)
    }

    // Initialize budget with calculated medical costs
    if (!budget) {
      const medicalCategory: BudgetCategory = {
        id: 'medical',
        name: 'Medical',
        description: 'Insurance, hospital bills, OOP costs',
        icon: 'medical_services',
        color: 'medical',
        items: [
          { id: 'med-1', name: 'Annual Premiums', estimated: calculatedCosts.annualPremium, actual: null, purchased: false },
          { id: 'med-2', name: 'Out-of-Pocket Maximum', estimated: calculatedCosts.expectedOop, actual: null, purchased: false },
          { id: 'med-3', name: 'HSA/HRA Offset', estimated: -(calculatedCosts.employerHsa || 0), actual: null, purchased: false, note: 'Reduces your costs' },
        ],
      }
      setBudget([
        medicalCategory,
        ...DEFAULT_BUDGET_CATEGORIES.filter(c => c.id !== 'medical'),
      ])
    }
  }

  // === TASK ACTIONS ===

  const toggleTask = (taskId: string) => {
    if (!tasks) return
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ))
  }

  const addTask = (newTask: Omit<Task, 'id' | 'userAdded' | 'completed'>) => {
    if (!tasks) return
    const task: Task = {
      ...newTask,
      id: `custom-${Date.now()}`,
      userAdded: true,
      completed: false,
    }
    setTasks([...tasks, task])
  }

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    if (!tasks) return
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, ...updates } : task
    ))
  }

  const deleteTask = (taskId: string) => {
    if (!tasks) return
    setTasks(tasks.filter(task => task.id !== taskId))
  }

  // === BUDGET ACTIONS ===

  const toggleBudgetItem = (categoryId: string, itemId: string) => {
    if (!budget) return
    setBudget(budget.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          items: cat.items.map(item =>
            item.id === itemId ? { ...item, purchased: !item.purchased } : item
          ),
        }
      }
      return cat
    }))
  }

  const updateBudgetItem = (categoryId: string, itemId: string, updates: Partial<BudgetCategory['items'][0]>) => {
    if (!budget) return
    setBudget(budget.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          items: cat.items.map(item =>
            item.id === itemId ? { ...item, ...updates } : item
          ),
        }
      }
      return cat
    }))
  }

  const addBudgetItem = (categoryId: string, item: Omit<BudgetCategory['items'][0], 'id'>) => {
    if (!budget) return
    const newItem = {
      ...item,
      id: `${categoryId}-${Date.now()}`,
    }
    setBudget(budget.map(cat => {
      if (cat.id === categoryId) {
        return { ...cat, items: [...cat.items, newItem] }
      }
      return cat
    }))
  }

  const deleteBudgetItem = (categoryId: string, itemId: string) => {
    if (!budget) return
    setBudget(budget.map(cat => {
      if (cat.id === categoryId) {
        return { ...cat, items: cat.items.filter(item => item.id !== itemId) }
      }
      return cat
    }))
  }

  // === USER ACTIONS ===

  const updateCashOnHand = (amount: number) => {
    if (!userData) return
    setUserData({ ...userData, cashOnHand: amount })
  }

  const resetAllData = () => {
    setUserData(null)
    setTasks(null)
    setBudget(null)
  }

  return {
    // State
    userData,
    tasks,
    budget,
    isLoaded,
    isOnboarded,

    // User actions
    initializeUser,
    setUserData,
    updateCashOnHand,
    resetAllData,

    // Task actions
    toggleTask,
    addTask,
    updateTask,
    deleteTask,

    // Budget actions
    toggleBudgetItem,
    updateBudgetItem,
    addBudgetItem,
    deleteBudgetItem,
  }
}
