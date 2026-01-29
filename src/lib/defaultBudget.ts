import { BudgetCategory } from './types'

// Note: Medical category items are populated dynamically from calculator results
export const DEFAULT_BUDGET_CATEGORIES: BudgetCategory[] = [
  {
    id: 'medical',
    name: 'Medical',
    description: 'Insurance, hospital bills, OOP costs',
    icon: 'medical_services',
    color: 'blue',
    items: [], // Populated from calculator
  },
  {
    id: 'gear',
    name: 'Gear',
    description: 'Strollers, car seats, carriers',
    icon: 'shopping_bag',
    color: 'purple',
    items: [
      { id: 'gear-1', name: 'Car Seat', estimated: 350, actual: null, purchased: false },
      { id: 'gear-2', name: 'Stroller', estimated: 500, actual: null, purchased: false },
      { id: 'gear-3', name: 'Baby Monitor', estimated: 150, actual: null, purchased: false },
      { id: 'gear-4', name: 'Diaper Bag', estimated: 80, actual: null, purchased: false },
      { id: 'gear-5', name: 'Bottles & Feeding', estimated: 100, actual: null, purchased: false },
      { id: 'gear-6', name: 'Breast Pump', estimated: 0, actual: null, purchased: false, note: 'Often covered by insurance' },
    ],
  },
  {
    id: 'nursery',
    name: 'Nursery',
    description: 'Furniture, decor, setup',
    icon: 'crib',
    color: 'teal',
    items: [
      { id: 'nur-1', name: 'Crib', estimated: 350, actual: null, purchased: false },
      { id: 'nur-2', name: 'Crib Mattress', estimated: 150, actual: null, purchased: false },
      { id: 'nur-3', name: 'Dresser/Changing Table', estimated: 400, actual: null, purchased: false },
      { id: 'nur-4', name: 'Glider/Rocker', estimated: 400, actual: null, purchased: false },
      { id: 'nur-5', name: 'Bedding Set', estimated: 100, actual: null, purchased: false },
      { id: 'nur-6', name: 'Blackout Curtains', estimated: 80, actual: null, purchased: false },
      { id: 'nur-7', name: 'Sound Machine', estimated: 40, actual: null, purchased: false },
    ],
  },
  {
    id: 'childcare',
    name: 'Childcare',
    description: 'Daycare deposits, backup care',
    icon: 'child_care',
    color: 'orange',
    items: [
      { id: 'cc-1', name: 'Daycare Deposit', estimated: 500, actual: null, purchased: false },
      { id: 'cc-2', name: 'First Month Daycare', estimated: 1500, actual: null, purchased: false },
      { id: 'cc-3', name: 'Backup Care Fund', estimated: 300, actual: null, purchased: false },
    ],
  },
]

// Color classes for Tailwind
export const CATEGORY_COLOR_CLASSES: Record<string, { bg: string; text: string; progress: string; border: string }> = {
  blue: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    progress: 'bg-blue-500',
    border: 'border-blue-500/30',
  },
  purple: {
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
    progress: 'bg-purple-500',
    border: 'border-purple-500/30',
  },
  teal: {
    bg: 'bg-teal-500/10',
    text: 'text-teal-400',
    progress: 'bg-teal-500',
    border: 'border-teal-500/30',
  },
  orange: {
    bg: 'bg-orange-500/10',
    text: 'text-orange-400',
    progress: 'bg-orange-500',
    border: 'border-orange-500/30',
  },
  green: {
    bg: 'bg-green-500/10',
    text: 'text-green-400',
    progress: 'bg-green-500',
    border: 'border-green-500/30',
  },
}
