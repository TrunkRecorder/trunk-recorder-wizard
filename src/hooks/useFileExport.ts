import { useCallback } from 'react'
import { saveAs } from 'file-saver'
import { useConfigStore, TrunkRecorderConfig } from '../stores/configStore'

export function useFileExport() {
  const { config, markClean } = useConfigStore()

  const prepareConfigForExport = useCallback((cfg: TrunkRecorderConfig): object => {
    // Remove internal IDs and empty optional fields
    const cleanObject = (obj: any): any => {
      if (obj === null || obj === undefined) return undefined
      if (Array.isArray(obj)) {
        return obj.map(cleanObject).filter(item => item !== undefined)
      }
      if (typeof obj === 'object') {
        const { id, ...rest } = obj
        return Object.fromEntries(
          Object.entries(rest)
            .map(([key, value]) => [key, cleanObject(value)])
            .filter(([_, value]) => value !== undefined && value !== null && value !== '')
        )
      }
      return obj
    }

    const { sources, systems, plugins, ...globalConfig } = cfg

    const cleaned: any = {
      ver: 2,
      ...Object.fromEntries(
        Object.entries(globalConfig).filter(([_, v]) => v !== undefined && v !== null && v !== '')
      ),
      sources: sources.map(s => {
        const { id, ...rest } = s
        return cleanObject(rest)
      }),
      systems: systems.map(s => {
        const { id, ...rest } = s
        return cleanObject(rest)
      })
    }

    if (plugins && plugins.length > 0) {
      cleaned.plugins = plugins.map(p => {
        const { id, ...rest } = p
        return cleanObject(rest)
      })
    }

    return cleaned
  }, [])

  const exportToJson = useCallback((): string => {
    const cleaned = prepareConfigForExport(config)
    return JSON.stringify(cleaned, null, 4)
  }, [config, prepareConfigForExport])

  const downloadConfig = useCallback((filename: string = 'config.json') => {
    const json = exportToJson()
    const blob = new Blob([json], { type: 'application/json;charset=utf-8' })
    saveAs(blob, filename)
    markClean()
  }, [exportToJson, markClean])

  const copyToClipboard = useCallback(async (): Promise<boolean> => {
    try {
      const json = exportToJson()
      await navigator.clipboard.writeText(json)
      return true
    } catch {
      return false
    }
  }, [exportToJson])

  return {
    exportToJson,
    downloadConfig,
    copyToClipboard,
    prepareConfigForExport
  }
}
