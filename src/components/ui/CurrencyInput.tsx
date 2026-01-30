import { getIntegerError } from '@/lib/validation'

interface CurrencyInputProps {
  label: string
  value: string
  onChange: (value: string) => void
  error: string | null
  onErrorChange: (error: string | null) => void
  required?: boolean
  placeholder?: string
  helpText?: string
}

export default function CurrencyInput({
  label,
  value,
  onChange,
  error,
  onErrorChange,
  required = false,
  placeholder = '0',
  helpText,
}: CurrencyInputProps) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const newValue = e.target.value
    onChange(newValue)
    onErrorChange(getIntegerError(newValue))
  }

  const borderClass = error
    ? 'border-red-500 focus:border-red-500'
    : 'border-gray-700 focus:border-primary'

  return (
    <div>
      <label className="block text-sm text-gray-400 mb-2">
        {label}{required && ' *'}
      </label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
        <input
          type="text"
          inputMode="numeric"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
          className={`w-full bg-gray-800 border rounded-lg pl-8 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none ${borderClass}`}
        />
      </div>
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
      {helpText && !error && <p className="text-xs text-gray-500 mt-1">{helpText}</p>}
    </div>
  )
}
