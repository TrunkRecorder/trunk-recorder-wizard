import { useCallback, useMemo } from 'react'
import { useConfigStore } from '../../stores/configStore'
import { schemas } from '../../config/schema'
import { FieldRenderer } from '../fields/FieldRenderer'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'

interface SystemEditorProps {
  systemId: string
}

export function SystemEditor({ systemId }: SystemEditorProps) {
  const { config, updateSystem, removeSystem, showAdvanced } = useConfigStore()

  const system = useMemo(
    () => config.systems.find(s => s.id === systemId),
    [config.systems, systemId]
  )

  // Group fields by category
  const groupedFields = useMemo(() => {
    const groups: Record<string, typeof schemas.system.fields> = {
      'Basic': [],
      'upload': [],
      'recording': [],
      'other': []
    }

    schemas.system.fields.forEach(field => {
      if (field.advanced && !showAdvanced) return

      const group = field.group || 'other'
      if (!groups[group]) groups[group] = []
      groups[group].push(field)
    })

    return groups
  }, [showAdvanced])

  const handleFieldChange = useCallback((key: string, value: unknown) => {
    updateSystem(systemId, { [key]: value })
  }, [systemId, updateSystem])

  if (!system) return null

  const typeLabels: Record<string, string> = {
    p25: 'P25 Trunked',
    smartnet: 'SmartNet',
    conventional: 'Conventional',
    conventionalDMR: 'Conventional DMR',
    conventionalP25: 'Conventional P25',
    conventionalSIGMF: 'Conventional SigMF'
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {system.shortName || 'Unnamed System'}
          </h3>
          <p className="text-sm text-gray-500">
            {typeLabels[system.type] || system.type}
          </p>
        </div>
        <Button
          variant="danger"
          size="sm"
          onClick={() => removeSystem(systemId)}
        >
          Delete System
        </Button>
      </div>

      {Object.entries(groupedFields).map(([groupName, fields]) => {
        if (fields.length === 0) return null

        return (
          <div key={groupName} className="mb-8 last:mb-0">
            {groupName !== 'other' && (
              <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4 pb-2 border-b">
                {groupName === 'upload' ? 'Upload Settings' :
                 groupName === 'recording' ? 'Recording Options' : groupName}
              </h4>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {fields.map(field => (
                <div key={field.key} className={field.type === 'array' ? 'md:col-span-2' : ''}>
                  <FieldRenderer
                    field={field}
                    value={system[field.key]}
                    onChange={(value) => handleFieldChange(field.key, value)}
                    parentData={system as Record<string, unknown>}
                  />
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </Card>
  )
}
