import { useConfigStore } from '../../stores/configStore'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'

export function SystemList() {
  const { config, addSystem, setSelectedItemId } = useConfigStore()

  if (config.systems.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-900">Radio Systems</h2>
          <Button onClick={addSystem}>Add System</Button>
        </div>
        <Card className="p-8 text-center">
          <p className="text-gray-500 mb-4">No systems configured.</p>
          <Button onClick={addSystem}>Add Your First System</Button>
        </Card>
      </div>
    )
  }

  const typeLabels: Record<string, string> = {
    p25: 'P25 Trunked',
    smartnet: 'SmartNet',
    conventional: 'Conventional',
    conventionalDMR: 'Conventional DMR',
    conventionalP25: 'Conventional P25',
    conventionalSIGMF: 'Conventional SigMF'
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">
          Radio Systems ({config.systems.length})
        </h2>
        <Button onClick={addSystem}>Add System</Button>
      </div>

      <div className="space-y-3">
        {config.systems.map((system) => (
          <Card
            key={system.id}
            className="p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedItemId(system.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-semibold text-gray-900">
                    {system.shortName || 'Unnamed System'}
                  </span>
                  <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full">
                    {typeLabels[system.type] || system.type}
                  </span>
                  {system.enabled === false && (
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                      Disabled
                    </span>
                  )}
                </div>
                <div className="mt-1 text-sm text-gray-600 space-x-4">
                  {system.control_channels && system.control_channels.length > 0 && (
                    <span>Control: {system.control_channels.length} channel{system.control_channels.length !== 1 ? 's' : ''}</span>
                  )}
                  {system.channels && system.channels.length > 0 && (
                    <span>Channels: {system.channels.length}</span>
                  )}
                  {system.talkgroupsFile && (
                    <span>TG File: {system.talkgroupsFile}</span>
                  )}
                </div>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedItemId(system.id)
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
