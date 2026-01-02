import { useCallback } from 'react'
import { useConfigStore } from '../../stores/configStore'
import { schemas } from '../../config/schema'
import { FieldRenderer } from '../fields/FieldRenderer'
import { Card } from '../ui/Card'

export function GlobalSettings() {
  const { config, updateGlobal, showAdvanced } = useConfigStore()

  const visibleFields = schemas.global.fields.filter(field => {
    if (field.advanced && !showAdvanced) return false
    return true
  })

  const handleFieldChange = useCallback((key: string, value: unknown) => {
    updateGlobal(key, value)
  }, [updateGlobal])

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Global Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {visibleFields.map(field => (
            <div key={field.key} className={field.type === 'array' ? 'md:col-span-2' : ''}>
              <FieldRenderer
                field={field}
                value={config[field.key]}
                onChange={(value) => handleFieldChange(field.key, value)}
                parentData={config as Record<string, unknown>}
              />
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
