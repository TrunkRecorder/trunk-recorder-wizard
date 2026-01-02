import { useMemo, useState } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { json } from '@codemirror/lang-json'
import { useConfigStore } from '../../stores/configStore'
import { useFileExport } from '../../hooks/useFileExport'
import { Button } from '../ui/Button'

export function JsonPreview() {
  const { config, validationErrors } = useConfigStore()
  const { exportToJson, copyToClipboard } = useFileExport()
  const [copied, setCopied] = useState(false)

  const jsonString = useMemo(() => exportToJson(), [exportToJson, config])

  const handleCopy = async () => {
    const success = await copyToClipboard()
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const errorCount = validationErrors.filter(e => e.severity === 'error').length
  const warningCount = validationErrors.filter(e => e.severity === 'warning').length

  return (
    <div className="h-full flex flex-col bg-white border-l border-gray-200">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="font-medium text-gray-900">Preview</h3>
          {errorCount > 0 && (
            <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full">
              {errorCount} errors
            </span>
          )}
          {warningCount > 0 && (
            <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full">
              {warningCount} warnings
            </span>
          )}
        </div>
        <Button variant="secondary" size="sm" onClick={handleCopy}>
          {copied ? 'Copied!' : 'Copy'}
        </Button>
      </div>

      <div className="flex-1 overflow-auto">
        <CodeMirror
          value={jsonString}
          extensions={[json()]}
          editable={false}
          theme="light"
          className="h-full text-sm"
          basicSetup={{
            lineNumbers: true,
            foldGutter: true,
            highlightActiveLineGutter: false,
            highlightActiveLine: false
          }}
        />
      </div>
    </div>
  )
}
