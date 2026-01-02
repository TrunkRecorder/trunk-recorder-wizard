import { useConfigStore } from '../../stores/configStore'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'

export function PluginList() {
  const { config, addPlugin, setSelectedItemId } = useConfigStore()

  const plugins = config.plugins || []

  if (plugins.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-900">Plugins</h2>
          <Button onClick={addPlugin}>Add Plugin</Button>
        </div>
        <Card className="p-8 text-center">
          <p className="text-gray-500 mb-4">No plugins configured.</p>
          <Button onClick={addPlugin}>Add Your First Plugin</Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">
          Plugins ({plugins.length})
        </h2>
        <Button onClick={addPlugin}>Add Plugin</Button>
      </div>

      <div className="space-y-3">
        {plugins.map((plugin) => (
          <Card
            key={plugin.id}
            className="p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedItemId(plugin.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-semibold text-gray-900">
                    {plugin.name || 'Unnamed Plugin'}
                  </span>
                  {!plugin.enabled && (
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                      Disabled
                    </span>
                  )}
                </div>
                <div className="mt-1 text-sm text-gray-600">
                  {plugin.library && <span>Library: {plugin.library}</span>}
                </div>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedItemId(plugin.id)
                }}
              >
                Edit
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
