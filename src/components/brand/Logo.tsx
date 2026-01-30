const sizeMap = {
  xs: { icon: 24, text: 'text-sm', tagline: 'text-[10px]' },
  sm: { icon: 32, text: 'text-lg', tagline: 'text-xs' },
  md: { icon: 40, text: 'text-xl', tagline: 'text-xs' },
  lg: { icon: 48, text: 'text-2xl', tagline: 'text-sm' },
  xl: { icon: 64, text: 'text-3xl', tagline: 'text-sm' },
} as const

type LogoSize = keyof typeof sizeMap
type LogoVariant = 'icon' | 'wordmark' | 'full'

interface LogoProps {
  variant?: LogoVariant
  size?: LogoSize
  showTagline?: boolean
  className?: string
}

function IconMinimal({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="60" cy="60" r="60" fill="#FF5500" />
      <circle cx="60" cy="60" r="50" fill="#111827" />
      <path
        d="M38 35 L38 85 L58 85 C75 85 85 73 85 60 C85 47 75 35 58 35 L38 35 Z M48 45 L56 45 C67 45 74 51 74 60 C74 69 67 75 56 75 L48 75 L48 45 Z"
        fill="#F5F5F5"
      />
    </svg>
  )
}

function Wordmark({ className }: { className?: string }) {
  return (
    <span className={`font-bold tracking-tight ${className}`}>
      <span className="text-white">DAD</span>
      <span className="text-primary">OPS</span>
    </span>
  )
}

export default function Logo({
  variant = 'full',
  size = 'md',
  showTagline = false,
  className = '',
}: LogoProps) {
  const dimensions = sizeMap[size]

  if (variant === 'icon') {
    return (
      <div className={className}>
        <IconMinimal size={dimensions.icon} />
      </div>
    )
  }

  if (variant === 'wordmark') {
    return <Wordmark className={`${dimensions.text} ${className}`} />
  }

  // Full logo: icon + wordmark
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <IconMinimal size={dimensions.icon} />
      <div>
        <Wordmark className={dimensions.text} />
        {showTagline && (
          <p className={`text-gray-400 ${dimensions.tagline}`}>Mission Control</p>
        )}
      </div>
    </div>
  )
}
