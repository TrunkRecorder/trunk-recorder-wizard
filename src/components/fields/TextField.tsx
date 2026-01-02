import { Input } from '../ui/Input'
import { Tooltip } from '../ui/Tooltip'

interface TextFieldProps {
  label: string
  description: string
  required?: boolean
  value: string
  onChange: (value: string) => void
  error?: string
  placeholder?: string
  minLength?: number
  maxLength?: number
  pattern?: string
}

export function TextField({
  label,
  description,
  required,
  value,
  onChange,
  error,
  placeholder,
  minLength,
  maxLength,
  pattern
}: TextFieldProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <Tooltip content={description}>
          <button type="button" className="text-gray-400 hover:text-gray-600">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </Tooltip>
      </div>
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        error={error}
        minLength={minLength}
        maxLength={maxLength}
        pattern={pattern}
      />
    </div>
  )
}
