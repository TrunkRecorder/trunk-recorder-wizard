import { useMemo, useCallback } from 'react'
import { z } from 'zod'
import { useConfigStore, ValidationError, TrunkRecorderConfig } from '../stores/configStore'
import { schemas, FieldDefinition, FieldCondition } from '../config/schema'

// Helper to check if conditions are met
function checkConditions(
  conditions: FieldCondition[] | undefined,
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

// Create Zod schema from field definition
function createFieldSchema(field: FieldDefinition, parentData?: Record<string, unknown>) {
  let schema: z.ZodTypeAny

  // Check if field should be validated (conditions met)
  if (parentData && !checkConditions(field.conditions, parentData)) {
    return z.any().optional()
  }

  switch (field.type) {
    case 'string':
      schema = z.string()
      if (field.minLength) schema = (schema as z.ZodString).min(field.minLength)
      if (field.maxLength) schema = (schema as z.ZodString).max(field.maxLength)
      if (field.pattern) schema = (schema as z.ZodString).regex(new RegExp(field.pattern))
      break

    case 'number':
    case 'frequency':
      schema = z.number()
      if (field.min !== undefined) schema = (schema as z.ZodNumber).min(field.min)
      if (field.max !== undefined) schema = (schema as z.ZodNumber).max(field.max)
      break

    case 'boolean':
      schema = z.boolean()
      break

    case 'select':
      if (field.options && field.options.length > 0) {
        const values = field.options.map(o => o.value)
        if (values.every(v => typeof v === 'string')) {
          schema = z.enum(values as [string, ...string[]])
        } else if (values.every(v => typeof v === 'number')) {
          schema = z.union(values.map(v => z.literal(v)) as [z.ZodLiteral<number>, z.ZodLiteral<number>, ...z.ZodLiteral<number>[]])
        } else {
          schema = z.unknown()
        }
      } else {
        schema = z.unknown()
      }
      break

    case 'array':
      if (field.itemType === 'frequency' || field.itemType === 'number') {
        schema = z.array(z.number())
      } else if (field.itemType === 'string') {
        schema = z.array(z.string())
      } else if (field.itemSchema) {
        // Array of objects
        const itemShape: Record<string, z.ZodTypeAny> = {}
        field.itemSchema.forEach(itemField => {
          itemShape[itemField.key] = createFieldSchema(itemField)
        })
        schema = z.array(z.object(itemShape))
      } else {
        schema = z.array(z.unknown())
      }
      if (field.minItems) schema = (schema as z.ZodArray<any>).min(field.minItems)
      if (field.maxItems) schema = (schema as z.ZodArray<any>).max(field.maxItems)
      break

    case 'object':
      if (field.properties) {
        const shape: Record<string, z.ZodTypeAny> = {}
        field.properties.forEach(prop => {
          shape[prop.key] = createFieldSchema(prop)
        })
        schema = z.object(shape)
      } else {
        schema = z.record(z.unknown())
      }
      break

    default:
      schema = z.unknown()
  }

  // Handle required vs optional
  const isRequired = typeof field.required === 'boolean'
    ? field.required
    : Array.isArray(field.required) && checkConditions(field.required, parentData || {})

  if (!isRequired) {
    schema = schema.optional().nullable()
  }

  return schema
}

export function useValidation() {
  const { config, setValidationErrors, validationErrors } = useConfigStore()

  const validate = useCallback((configToValidate: TrunkRecorderConfig): ValidationError[] => {
    const errors: ValidationError[] = []

    // Validate global config
    schemas.global.fields.forEach(field => {
      const value = configToValidate[field.key]
      const schema = createFieldSchema(field, configToValidate as Record<string, unknown>)

      const result = schema.safeParse(value)
      if (!result.success) {
        errors.push({
          path: field.key,
          message: `${field.label}: ${result.error.issues[0]?.message || 'Invalid value'}`,
          severity: 'error'
        })
      }
    })

    // Validate sources
    configToValidate.sources.forEach((source, index) => {
      schemas.source.fields.forEach(field => {
        if (!checkConditions(field.conditions, source as Record<string, unknown>)) {
          // Check for fields that shouldn't exist
          if (source[field.key] !== undefined && field.conditions) {
            errors.push({
              path: `sources[${index}].${field.key}`,
              message: `Source ${index + 1} - ${field.label}: This option is not valid for driver "${source.driver}"`,
              severity: 'warning'
            })
          }
          return
        }

        const value = source[field.key]
        const schema = createFieldSchema(field, source as Record<string, unknown>)

        const result = schema.safeParse(value)
        if (!result.success) {
          errors.push({
            path: `sources[${index}].${field.key}`,
            message: `Source ${index + 1} - ${field.label}: ${result.error.issues[0]?.message || 'Invalid value'}`,
            severity: 'error'
          })
        }
      })

      // Custom validation: check for both error and ppm
      if (source.error !== undefined && source.ppm !== undefined && (source.error !== 0 || source.ppm !== 0)) {
        errors.push({
          path: `sources[${index}]`,
          message: `Source ${index + 1}: Use either 'error' or 'ppm' for frequency correction, not both`,
          severity: 'warning'
        })
      }
    })

    // Validate systems
    configToValidate.systems.forEach((system, index) => {
      schemas.system.fields.forEach(field => {
        if (!checkConditions(field.conditions, system as Record<string, unknown>)) {
          // Check for fields that shouldn't exist
          if (system[field.key] !== undefined && field.conditions) {
            errors.push({
              path: `systems[${index}].${field.key}`,
              message: `System "${system.shortName}" - ${field.label}: This option is not valid for ${system.type} systems`,
              severity: 'warning'
            })
          }
          return
        }

        const value = system[field.key]
        const schema = createFieldSchema(field, system as Record<string, unknown>)

        const result = schema.safeParse(value)
        if (!result.success) {
          errors.push({
            path: `systems[${index}].${field.key}`,
            message: `System "${system.shortName}" - ${field.label}: ${result.error.issues[0]?.message || 'Invalid value'}`,
            severity: 'error'
          })
        }
      })

      // Custom validation: conventional systems need channels OR channelFile
      if (system.type?.startsWith('conventional')) {
        const hasChannels = system.channels && Array.isArray(system.channels) && system.channels.length > 0
        const hasChannelFile = system.channelFile && system.channelFile.trim() !== ''

        if (!hasChannels && !hasChannelFile) {
          errors.push({
            path: `systems[${index}]`,
            message: `System "${system.shortName}": Conventional systems require either channels or channelFile`,
            severity: 'error'
          })
        }
        if (hasChannels && hasChannelFile) {
          errors.push({
            path: `systems[${index}]`,
            message: `System "${system.shortName}": Use channels OR channelFile, not both`,
            severity: 'warning'
          })
        }
      }

      // Check for duplicate system shortNames
      const duplicates = configToValidate.systems.filter(s => s.shortName === system.shortName)
      if (duplicates.length > 1) {
        errors.push({
          path: `systems[${index}].shortName`,
          message: `System "${system.shortName}": Duplicate shortName detected`,
          severity: 'error'
        })
      }
    })

    // Validate plugins
    configToValidate.plugins?.forEach((plugin, index) => {
      schemas.plugin.fields.forEach(field => {
        const value = plugin[field.key]
        const schema = createFieldSchema(field, plugin as Record<string, unknown>)

        const result = schema.safeParse(value)
        if (!result.success) {
          errors.push({
            path: `plugins[${index}].${field.key}`,
            message: `Plugin ${index + 1} - ${field.label}: ${result.error.issues[0]?.message || 'Invalid value'}`,
            severity: 'error'
          })
        }
      })
    })

    // Global validations
    if (configToValidate.ver !== 2) {
      errors.push({
        path: 'ver',
        message: 'Config version must be 2',
        severity: 'error'
      })
    }

    if (configToValidate.sources.length === 0) {
      errors.push({
        path: 'sources',
        message: 'At least one source is required',
        severity: 'error'
      })
    }

    if (configToValidate.systems.length === 0) {
      errors.push({
        path: 'systems',
        message: 'At least one system is required',
        severity: 'error'
      })
    }

    // Check if audioStreaming is required for simplestream plugin
    const hasSimpleStream = configToValidate.plugins?.some(p => p.name === 'simplestream')
    if (hasSimpleStream && !configToValidate.audioStreaming) {
      errors.push({
        path: 'audioStreaming',
        message: 'audioStreaming must be enabled when using the simplestream plugin',
        severity: 'error'
      })
    }

    return errors
  }, [])

  const validateAndUpdate = useCallback(() => {
    const errors = validate(config)
    setValidationErrors(errors)
    return errors
  }, [config, validate, setValidationErrors])

  const errorCount = useMemo(() =>
    validationErrors.filter(e => e.severity === 'error').length,
    [validationErrors]
  )

  const warningCount = useMemo(() =>
    validationErrors.filter(e => e.severity === 'warning').length,
    [validationErrors]
  )

  return {
    validate,
    validateAndUpdate,
    errorCount,
    warningCount,
    validationErrors
  }
}
