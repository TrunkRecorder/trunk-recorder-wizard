import { clsx } from 'clsx'

interface ValidationReportProps {
  result: {
    success: boolean
    jsonErrors?: { line: number; column: number; message: string }[]
    schemaWarnings?: { path: string; message: string }[]
  }
}

export function ValidationReport({ result }: ValidationReportProps) {
  const hasJsonErrors = result.jsonErrors && result.jsonErrors.length > 0
  const hasWarnings = result.schemaWarnings && result.schemaWarnings.length > 0

  return (
    <div className="space-y-4">
      {/* Status indicator */}
      <div className={clsx(
        'p-4 rounded-lg flex items-start gap-3',
        hasJsonErrors ? 'bg-red-50 border border-red-200' :
        hasWarnings ? 'bg-yellow-50 border border-yellow-200' :
        'bg-green-50 border border-green-200'
      )}>
        <div className={clsx(
          'w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0',
          hasJsonErrors ? 'bg-red-500' :
          hasWarnings ? 'bg-yellow-500' :
          'bg-green-500'
        )}>
          {hasJsonErrors ? (
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : hasWarnings ? (
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
        <div>
          <h4 className={clsx(
            'font-medium',
            hasJsonErrors ? 'text-red-800' :
            hasWarnings ? 'text-yellow-800' :
            'text-green-800'
          )}>
            {hasJsonErrors ? 'Invalid JSON' :
             hasWarnings ? 'Valid with Warnings' :
             'Valid Configuration'}
          </h4>
          <p className={clsx(
            'text-sm mt-1',
            hasJsonErrors ? 'text-red-700' :
            hasWarnings ? 'text-yellow-700' :
            'text-green-700'
          )}>
            {hasJsonErrors ? 'Fix JSON syntax errors before importing.' :
             hasWarnings ? 'Some fields may be ignored or have invalid values.' :
             'Configuration is ready to import.'}
          </p>
        </div>
      </div>

      {/* JSON Errors */}
      {hasJsonErrors && (
        <div className="space-y-2">
          <h5 className="text-sm font-medium text-gray-700">JSON Syntax Errors</h5>
          {result.jsonErrors!.map((error, i) => (
            <div
              key={i}
              className="p-3 bg-red-50 rounded border border-red-100 font-mono text-sm"
            >
              <span className="text-red-600">Line {error.line}, Column {error.column}:</span>
              <span className="text-red-800 ml-2">{error.message}</span>
            </div>
          ))}
        </div>
      )}

      {/* Schema Warnings */}
      {hasWarnings && (
        <div className="space-y-2">
          <h5 className="text-sm font-medium text-gray-700">
            Configuration Warnings ({result.schemaWarnings!.length})
          </h5>
          <div className="max-h-60 overflow-y-auto space-y-2">
            {result.schemaWarnings!.map((warning, i) => (
              <div
                key={i}
                className="p-3 bg-yellow-50 rounded border border-yellow-100 text-sm"
              >
                <code className="text-yellow-700 font-mono text-xs">{warning.path}</code>
                <p className="text-yellow-800 mt-1">{warning.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
