import { useConfigStore } from '../../stores/configStore'
import { Card } from '../ui/Card'

export function ValidationPanel() {
  const { validationErrors, config, setSelectedSection, setSelectedItemId } = useConfigStore()

  const errors = validationErrors.filter(e => e.severity === 'error')
  const warnings = validationErrors.filter(e => e.severity === 'warning')

  const handleErrorClick = (path: string) => {
    // Parse the path to determine section and item
    const parts = path.split('.')

    if (parts[0] === 'global') {
      setSelectedSection('global')
      setSelectedItemId(null)
    } else if (parts[0] === 'sources') {
      setSelectedSection('sources')
      if (parts[1] && !isNaN(parseInt(parts[1]))) {
        const index = parseInt(parts[1])
        if (config.sources && config.sources[index]) {
          setSelectedItemId(config.sources[index].id)
        }
      } else {
        setSelectedItemId(null)
      }
    } else if (parts[0] === 'systems') {
      setSelectedSection('systems')
      if (parts[1] && !isNaN(parseInt(parts[1]))) {
        const index = parseInt(parts[1])
        if (config.systems && config.systems[index]) {
          setSelectedItemId(config.systems[index].id)
        }
      } else {
        setSelectedItemId(null)
      }
    } else if (parts[0] === 'plugins') {
      setSelectedSection('plugins')
      if (parts[1] && !isNaN(parseInt(parts[1]))) {
        const index = parseInt(parts[1])
        if (config.plugins && config.plugins[index]) {
          setSelectedItemId(config.plugins[index].id)
        }
      } else {
        setSelectedItemId(null)
      }
    }
  }

  const formatPath = (path: string): string => {
    const parts = path.split('.')

    if (parts[0] === 'global') {
      return `Global Settings → ${parts.slice(1).join(' → ')}`
    } else if (parts[0] === 'sources') {
      const index = parts[1] ? parseInt(parts[1]) : null
      const source = index !== null && config.sources?.[index]
      const sourceName = source ? `Source #${index + 1} (${source.driver})` : `Source #${(index ?? 0) + 1}`
      return parts.length > 2
        ? `${sourceName} → ${parts.slice(2).join(' → ')}`
        : `Sources`
    } else if (parts[0] === 'systems') {
      const index = parts[1] ? parseInt(parts[1]) : null
      const system = index !== null && config.systems?.[index]
      const systemName = system
        ? `System #${index + 1}${system.shortName ? ` (${system.shortName})` : ''}`
        : `System #${(index ?? 0) + 1}`
      return parts.length > 2
        ? `${systemName} → ${parts.slice(2).join(' → ')}`
        : `Systems`
    } else if (parts[0] === 'plugins') {
      const index = parts[1] ? parseInt(parts[1]) : null
      const plugin = index !== null && config.plugins?.[index]
      const pluginName = plugin
        ? `Plugin #${index + 1}${plugin.name ? ` (${plugin.name})` : ''}`
        : `Plugin #${(index ?? 0) + 1}`
      return parts.length > 2
        ? `${pluginName} → ${parts.slice(2).join(' → ')}`
        : `Plugins`
    }

    return path
  }

  if (errors.length === 0 && warnings.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Validation</h2>
          <p className="text-sm text-gray-600">
            Review all configuration errors and warnings
          </p>
        </div>

        <Card className="p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Configuration Valid
          </h3>
          <p className="text-sm text-gray-600">
            No errors or warnings found. Your configuration is ready to export.
          </p>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Validation</h2>
        <p className="text-sm text-gray-600">
          Review and fix configuration errors and warnings
        </p>
      </div>

      <div className="space-y-6">
        {errors.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-red-900 mb-3 flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-6 h-6 bg-red-100 text-red-600 rounded-full text-xs font-bold">
                {errors.length}
              </span>
              {errors.length === 1 ? 'Error' : 'Errors'}
            </h3>
            <div className="space-y-2">
              {errors.map((error, index) => (
                <button
                  key={index}
                  onClick={() => handleErrorClick(error.path)}
                  className="w-full text-left p-4 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-red-900">{error.message}</p>
                      <p className="text-xs text-red-700 mt-1">{formatPath(error.path)}</p>
                    </div>
                    <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {warnings.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-yellow-900 mb-3 flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-6 h-6 bg-yellow-100 text-yellow-600 rounded-full text-xs font-bold">
                {warnings.length}
              </span>
              {warnings.length === 1 ? 'Warning' : 'Warnings'}
            </h3>
            <div className="space-y-2">
              {warnings.map((warning, index) => (
                <button
                  key={index}
                  onClick={() => handleErrorClick(warning.path)}
                  className="w-full text-left p-4 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-yellow-900">{warning.message}</p>
                      <p className="text-xs text-yellow-700 mt-1">{formatPath(warning.path)}</p>
                    </div>
                    <svg className="w-5 h-5 text-yellow-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
