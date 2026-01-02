import { useEffect } from 'react'
import { AppShell } from './components/layout/AppShell'
import { ConfigEditor } from './components/editor/ConfigEditor'
import { JsonPreview } from './components/editor/JsonPreview'
import { useValidation } from './hooks/useValidation'
import { useConfigStore } from './stores/configStore'

export default function App() {
  const { config } = useConfigStore()
  const { validateAndUpdate } = useValidation()

  // Validate on config changes (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      validateAndUpdate()
    }, 500)

    return () => clearTimeout(timer)
  }, [config, validateAndUpdate])

  return (
    <AppShell>
      <div className="flex gap-6 h-[calc(100vh-8rem)]">
        <div className="flex-1 overflow-auto">
          <ConfigEditor />
        </div>
        <div className="w-96 flex-shrink-0">
          <JsonPreview />
        </div>
      </div>
    </AppShell>
  )
}
