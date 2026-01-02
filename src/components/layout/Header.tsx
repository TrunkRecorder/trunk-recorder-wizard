import { useState } from 'react'
import { useConfigStore } from '../../stores/configStore'
import { useFileExport } from '../../hooks/useFileExport'
import { useValidation } from '../../hooks/useValidation'
import { Button } from '../ui/Button'
import { ImportWizard } from '../import/ImportWizard'

export function Header() {
  const { isDirty, resetConfig, showAdvanced, setShowAdvanced, validationErrors } = useConfigStore()
  const { downloadConfig } = useFileExport()
  const { validateAndUpdate } = useValidation()
  const [showImport, setShowImport] = useState(false)

  const errorCount = validationErrors.filter(e => e.severity === 'error').length

  const handleExport = () => {
    const errors = validateAndUpdate()
    if (errors.filter(e => e.severity === 'error').length === 0) {
      downloadConfig()
    }
  }

  return (
    <>
      <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
            Trunk Recorder Wizard
          </h1>
          {isDirty && (
            <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
              Unsaved changes
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={showAdvanced}
              onChange={(e) => setShowAdvanced(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            Show advanced
          </label>

          <Button variant="secondary" onClick={resetConfig}>
            New
          </Button>

          <Button variant="secondary" onClick={() => setShowImport(true)}>
            Import
          </Button>

          <Button
            variant="primary"
            onClick={handleExport}
            disabled={errorCount > 0}
          >
            Export
            {errorCount > 0 && (
              <span className="ml-2 px-1.5 py-0.5 text-xs bg-red-500 rounded-full">
                {errorCount}
              </span>
            )}
          </Button>
        </div>
      </header>

      <ImportWizard isOpen={showImport} onClose={() => setShowImport(false)} />
    </>
  )
}
