export type FieldType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'select'
  | 'array'
  | 'object'
  | 'frequency'    // Special: Hz input with MHz display option
  | 'gainSettings' // Special: multi-stage gain object

export interface FieldCondition {
  // Field is only shown/applicable when these conditions are met
  field: string           // Path to dependent field (dot notation)
  operator: 'eq' | 'neq' | 'in' | 'notIn' | 'exists' | 'notExists'
  value?: unknown         // Value to compare against
}

export interface FieldDefinition {
  key: string
  type: FieldType
  label: string
  description: string
  required: boolean | FieldCondition[]  // Can be conditionally required
  default?: unknown
  placeholder?: string

  // Type-specific options
  options?: { value: string | number; label: string }[]  // For select
  min?: number           // For number
  max?: number           // For number
  step?: number          // For number
  itemType?: FieldType   // For array
  itemSchema?: FieldDefinition[]  // For array of objects
  properties?: FieldDefinition[]  // For object type

  // Visibility conditions
  conditions?: FieldCondition[]  // Show only when all conditions met

  // Validation
  pattern?: string       // Regex pattern for string validation
  minLength?: number
  maxLength?: number
  minItems?: number      // For arrays
  maxItems?: number      // For arrays

  // UI hints
  group?: string         // Group related fields together
  advanced?: boolean     // Hide in basic view, show in advanced
  deprecated?: boolean   // Show warning if used
  deprecatedMessage?: string
}

export interface SchemaSection {
  id: string
  title: string
  description: string
  fields: FieldDefinition[]
}
