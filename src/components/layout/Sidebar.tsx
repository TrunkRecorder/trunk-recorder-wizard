import { clsx } from 'clsx'
import { useConfigStore } from '../../stores/configStore'

const navItems = [
  { id: 'global', label: 'Global Settings', icon: '⚙️' },
  { id: 'sources', label: 'SDR Sources', icon: '📡' },
  { id: 'systems', label: 'Radio Systems', icon: '📻' },
  { id: 'plugins', label: 'Plugins', icon: '🔌' },
  { id: 'validation', label: 'Validation', icon: '✓' }
] as const

export function Sidebar() {
  const {
    selectedSection,
    setSelectedSection,
    config,
    validationErrors
  } = useConfigStore()

  const getItemCount = (section: string) => {
    switch (section) {
      case 'sources': return config.sources.length
      case 'systems': return config.systems.length
      case 'plugins': return config.plugins?.length || 0
      default: return null
    }
  }

  const getErrorCount = (section: string) => {
    if (section === 'validation') {
      return validationErrors.length
    }
    return validationErrors.filter(e =>
      e.path.startsWith(section) ||
      (section === 'global' && !e.path.includes('['))
    ).length
  }

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)]">
      <nav className="p-4 space-y-1">
        {navItems.map(item => {
          const isActive = selectedSection === item.id
          const count = getItemCount(item.id)
          const errorCount = getErrorCount(item.id)

          return (
            <button
              key={item.id}
              onClick={() => setSelectedSection(item.id as any)}
              className={clsx(
                'w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              )}
            >
              <span className="flex items-center gap-2">
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </span>
              <span className="flex items-center gap-2">
                {count !== null && (
                  <span className={clsx(
                    'px-2 py-0.5 text-xs rounded-full',
                    isActive ? 'bg-blue-100' : 'bg-gray-100'
                  )}>
                    {count}
                  </span>
                )}
                {errorCount > 0 && (
                  <span className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-700">
                    {errorCount}
                  </span>
                )}
              </span>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
