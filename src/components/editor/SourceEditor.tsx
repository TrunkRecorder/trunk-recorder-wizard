import { useCallback, useMemo } from 'react'
import { useConfigStore } from '../../stores/configStore'
import { schemas } from '../../config/schema'
import { FieldRenderer } from '../fields/FieldRenderer'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'

interface SourceEditorProps {
  sourceId: string
}

export function SourceEditor({ sourceId }: SourceEditorProps) {
  const { config, updateSource, removeSource, showAdvanced } = useConfigStore()

  const source = useMemo(
    () => config.sources.find(s => s.id === sourceId),
    [config.sources, sourceId]
  )

  const visibleFields = useMemo(() => {
    return schemas.source.fields.filter(field => {
      if (field.advanced && !showAdvanced) return false
      return true
    })
  }, [showAdvanced])

  const handleFieldChange = useCallback((key: string, value: unknown) => {
    updateSource(sourceId, { [key]: value })
  }, [sourceId, updateSource])

  if (!source) return null

  const driverLabel = source.driver === 'osmosdr' ? 'OsmoSDR' :
                      source.driver === 'usrp' ? 'USRP' :
                      source.driver === 'sigmffile' ? 'SigMF File' :
                      source.driver === 'iqfile' ? 'IQ File' : source.driver

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {source.device || driverLabel}
          </h3>
          <p className="text-sm text-gray-500">Driver: {driverLabel}</p>
        </div>
        <Button
          variant="danger"
          size="sm"
          onClick={() => removeSource(sourceId)}
        >
          Delete Source
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {visibleFields.map(field => (
          <div key={field.key} className={field.type === 'array' ? 'md:col-span-2' : ''}>
            <FieldRenderer
              field={field}
              value={source[field.key]}
              onChange={(value) => handleFieldChange(field.key, value)}
              parentData={source as Record<string, unknown>}
            />
          </div>
        ))}
      </div>
    </Card>
  )
}
