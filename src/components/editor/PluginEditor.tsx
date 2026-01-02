import { useCallback, useMemo } from 'react'
import { useConfigStore } from '../../stores/configStore'
import { schemas } from '../../config/schema'
import { FieldRenderer } from '../fields/FieldRenderer'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'

interface PluginEditorProps {
  pluginId: string
}

export function PluginEditor({ pluginId }: PluginEditorProps) {
  const { config, updatePlugin, removePlugin } = useConfigStore()

  const plugin = useMemo(
    () => config.plugins?.find(p => p.id === pluginId),
    [config.plugins, pluginId]
  )

  const handleFieldChange = useCallback((key: string, value: unknown) => {
    updatePlugin(pluginId, { [key]: value })
  }, [pluginId, updatePlugin])

  if (!plugin) return null

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {plugin.name || 'Unnamed Plugin'}
          </h3>
          <p className="text-sm text-gray-500">
            Library: {plugin.library || 'Not specified'}
          </p>
        </div>
        <Button
          variant="danger"
          size="sm"
          onClick={() => removePlugin(pluginId)}
        >
          Delete Plugin
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {schemas.plugin.fields.map(field => (
          <div key={field.key} className={field.type === 'array' ? 'md:col-span-2' : ''}>
            <FieldRenderer
              field={field}
              value={plugin[field.key]}
              onChange={(value) => handleFieldChange(field.key, value)}
              parentData={plugin as Record<string, unknown>}
            />
          </div>
        ))}
      </div>
    </Card>
  )
}
