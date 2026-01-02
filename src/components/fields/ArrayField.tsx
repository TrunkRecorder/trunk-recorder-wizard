import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../ui/Button'
import { FrequencyField } from './FrequencyField'
import { Input } from '../ui/Input'
import { Tooltip } from '../ui/Tooltip'

interface ArrayFieldProps {
  label: string
  description: string
  required?: boolean
  value: unknown[]
  onChange: (value: unknown[]) => void
  error?: string
  itemType: string
  minItems?: number
  maxItems?: number
}

export function ArrayField({
  label,
  description,
  required,
  value,
  onChange,
  error,
  itemType,
  minItems,
  maxItems
}: ArrayFieldProps) {
  const canAdd = maxItems === undefined || value.length < maxItems
  const canRemove = minItems === undefined || value.length > minItems

  const addItem = () => {
    if (!canAdd) return
    let newItem: unknown
    switch (itemType) {
      case 'frequency':
      case 'number':
        newItem = 0
        break
      case 'string':
        newItem = ''
        break
      default:
        newItem = null
    }
    onChange([...value, newItem])
  }

  const removeItem = (index: number) => {
    if (!canRemove) return
    onChange(value.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, newValue: unknown) => {
    const updated = [...value]
    updated[index] = newValue
    onChange(updated)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
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
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={addItem}
          disabled={!canAdd}
        >
          Add
        </Button>
      </div>

      <AnimatePresence mode="popLayout">
        {value.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-start gap-2 p-3 bg-gray-50 rounded-md"
          >
            <div className="flex-1">
              {itemType === 'frequency' && (
                <FrequencyField
                  label={`${label} ${index + 1}`}
                  description=""
                  value={item as number}
                  onChange={(v) => updateItem(index, v)}
                />
              )}
              {itemType === 'number' && (
                <Input
                  type="number"
                  value={item as number}
                  onChange={(e) => updateItem(index, parseFloat(e.target.value))}
                />
              )}
              {itemType === 'string' && (
                <Input
                  type="text"
                  value={item as string}
                  onChange={(e) => updateItem(index, e.target.value)}
                />
              )}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeItem(index)}
              disabled={!canRemove}
              className="text-red-600 hover:text-red-700"
            >
              Remove
            </Button>
          </motion.div>
        ))}
      </AnimatePresence>

      {value.length === 0 && (
        <p className="text-sm text-gray-500 italic">
          No items. Click "Add" to add one.
        </p>
      )}

      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}
    </div>
  )
}
