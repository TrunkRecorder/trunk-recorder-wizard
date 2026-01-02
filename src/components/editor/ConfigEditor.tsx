import { useConfigStore } from '../../stores/configStore'
import { GlobalSettings } from './GlobalSettings'
import { SourceList } from './SourceList'
import { SourceEditor } from './SourceEditor'
import { SystemList } from './SystemList'
import { SystemEditor } from './SystemEditor'
import { PluginList } from './PluginList'
import { PluginEditor } from './PluginEditor'
import { ValidationPanel } from './ValidationPanel'
import { Button } from '../ui/Button'

export function ConfigEditor() {
  const { selectedSection, selectedItemId, setSelectedItemId } = useConfigStore()

  // Global settings
  if (selectedSection === 'global') {
    return <GlobalSettings />
  }

  // Sources
  if (selectedSection === 'sources') {
    if (selectedItemId) {
      return (
        <div className="space-y-4">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setSelectedItemId(null)}
          >
            ← Back to Sources List
          </Button>
          <SourceEditor sourceId={selectedItemId} />
        </div>
      )
    }
    return <SourceList />
  }

  // Systems
  if (selectedSection === 'systems') {
    if (selectedItemId) {
      return (
        <div className="space-y-4">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setSelectedItemId(null)}
          >
            ← Back to Systems List
          </Button>
          <SystemEditor systemId={selectedItemId} />
        </div>
      )
    }
    return <SystemList />
  }

  // Plugins
  if (selectedSection === 'plugins') {
    if (selectedItemId) {
      return (
        <div className="space-y-4">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setSelectedItemId(null)}
          >
            ← Back to Plugins List
          </Button>
          <PluginEditor pluginId={selectedItemId} />
        </div>
      )
    }
    return <PluginList />
  }

  // Validation
  if (selectedSection === 'validation') {
    return <ValidationPanel />
  }

  return null
}
