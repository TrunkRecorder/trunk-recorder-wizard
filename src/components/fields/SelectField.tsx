import { Select } from '../ui/Select'
import { Tooltip } from '../ui/Tooltip'

interface SelectFieldProps {
  label: string
  description: string
  required?: boolean
  value: string | number | undefined
  onChange: (value: string | number) => void
  error?: string
  options: { value: string | number; label: string }[]
}

export function SelectField({
  label,
  description,
  required,
  value,
  onChange,
  error,
  options
}: SelectFieldProps) {
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
      <Select
        value={value ?? ''}
        onChange={(e) => {
          const val = e.target.value
          const numVal = parseFloat(val)
          onChange(isNaN(numVal) ? val : numVal)
        }}
        error={error}
        options={options}
      />
    </div>
  )
}
