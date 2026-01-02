import { useConfigStore } from '../../stores/configStore'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'

export function SourceList() {
  const { config, addSource, setSelectedItemId } = useConfigStore()

  if (config.sources.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-900">SDR Sources</h2>
          <Button onClick={addSource}>Add Source</Button>
        </div>
        <Card className="p-8 text-center">
          <p className="text-gray-500 mb-4">No sources configured.</p>
          <Button onClick={addSource}>Add Your First Source</Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">
          SDR Sources ({config.sources.length})
        </h2>
        <Button onClick={addSource}>Add Source</Button>
      </div>

      <div className="space-y-3">
        {config.sources.map((source, index) => {
          const driverLabel = source.driver === 'osmosdr' ? 'OsmoSDR' :
                             source.driver === 'usrp' ? 'USRP' :
                             source.driver === 'sigmffile' ? 'SigMF' :
                             source.driver === 'iqfile' ? 'IQ File' : source.driver

          return (
            <Card
              key={source.id}
              className="p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedItemId(source.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-semibold text-gray-900">
                      Source {index + 1}
                    </span>
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                      {driverLabel}
                    </span>
                    {source.enabled === false && (
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                        Disabled
                      </span>
                    )}
                  </div>
                  <div className="mt-1 text-sm text-gray-600 space-x-4">
                    {source.device && <span>Device: {source.device}</span>}
                    {source.center && (
                      <span>Center: {(source.center / 1000000).toFixed(2)} MHz</span>
                    )}
                    {source.digitalRecorders !== undefined && (
                      <span>Digital: {source.digitalRecorders}</span>
                    )}
                    {source.analogRecorders !== undefined && (
                      <span>Analog: {source.analogRecorders}</span>
                    )}
                  </div>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedItemId(source.id)
                  }}
                >
                  Edit
                </Button>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
