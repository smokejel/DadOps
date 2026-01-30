import { Logo } from '@/components/brand'

interface LoadingSpinnerProps {
  message?: string
  showLogo?: boolean
}

export default function LoadingSpinner({
  message,
  showLogo = false,
}: LoadingSpinnerProps) {
  if (showLogo) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-pulse">
            <Logo variant="icon" size="lg" />
          </div>
          {message && <span className="text-gray-400">{message}</span>}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background-dark flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  )
}
