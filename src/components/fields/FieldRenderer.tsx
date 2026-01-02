import { FieldDefinition } from '../../config/schema'
import { TextField } from './TextField'
import { NumberField } from './NumberField'
import { BooleanField } from './BooleanField'
import { SelectField } from './SelectField'
import { ArrayField } from './ArrayField'
import { FrequencyField } from './FrequencyField'

interface FieldRendererProps {
  field: FieldDefinition
  value: unknown
  onChange: (value: unknown) => void
  error?: string
  parentData?: Record<string, unknown>
}

// Helper to check if conditions are met
function checkConditions(
  conditions: FieldDefinition['conditions'],
  data: Record<string, unknown>
): boolean {
  if (!conditions || conditions.length === 0) return true

  return conditions.every(condition => {
    const fieldValue = data[condition.field]

    switch (condition.operator) {
      case 'eq':
        return fieldValue === condition.value
      case 'neq':
        return fieldValue !== condition.value
      case 'in':
        return Array.isArray(condition.value) && condition.value.includes(fieldValue)
      case 'notIn':
        return Array.isArray(condition.value) && !condition.value.includes(fieldValue)
      case 'exists':
        return fieldValue !== undefined && fieldValue !== null && fieldValue !== ''
      case 'notExists':
        return fieldValue === undefined || fieldValue === null || fieldValue === ''
      default:
        return true
    }
  })
}

export function FieldRenderer({ field, value, onChange, error, parentData }: FieldRendererProps) {
  // Check visibility conditions
  if (field.conditions && parentData && !checkConditions(field.conditions, parentData)) {
    return null
  }

  const commonProps = {
    label: field.label,
    description: field.description,
    required: typeof field.required === 'boolean' ? field.required : false,
    error,
    placeholder: field.placeholder
  }

  switch (field.type) {
    case 'string':
      return (
        <TextField
          {...commonProps}
          value={(value as string) || ''}
          onChange={onChange}
          minLength={field.minLength}
          maxLength={field.maxLength}
          pattern={field.pattern}
        />
      )

    case 'number':
      return (
        <NumberField
          {...commonProps}
          value={value as number}
          onChange={onChange}
          min={field.min}
          max={field.max}
          step={field.step}
        />
      )

    case 'frequency':
      return (
        <FrequencyField
          {...commonProps}
          value={value as number}
          onChange={onChange}
        />
      )

    case 'boolean':
      return (
        <BooleanField
          label={field.label}
          description={field.description}
          value={value as boolean}
          onChange={onChange}
        />
      )

    case 'select':
      return (
        <SelectField
          {...commonProps}
          value={value as string | number}
          onChange={onChange}
          options={field.options || []}
        />
      )

    case 'array':
      return (
        <ArrayField
          {...commonProps}
          value={(value as unknown[]) || []}
          onChange={onChange}
          itemType={field.itemType || 'string'}
          minItems={field.minItems}
          maxItems={field.maxItems}
        />
      )

    default:
      return (
        <div className="text-sm text-gray-500">
          Unsupported field type: {field.type}
        </div>
      )
  }
}
