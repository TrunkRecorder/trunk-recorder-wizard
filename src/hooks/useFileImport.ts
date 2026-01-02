import { useCallback, useState } from 'react'
import { useConfigStore, TrunkRecorderConfig, ConfigSource, ConfigSystem, ConfigPlugin } from '../stores/configStore'
import { useValidation } from './useValidation'

interface ImportResult {
  success: boolean
  config?: TrunkRecorderConfig
  jsonErrors?: { line: number; column: number; message: string }[]
  schemaWarnings?: { path: string; message: string }[]
}

const generateId = () => crypto.randomUUID()

export function useFileImport() {
  const { setConfig } = useConfigStore()
  const { validate } = useValidation()
  const [isImporting, setIsImporting] = useState(false)
  const [importResult, setImportResult] = useState<ImportResult | null>(null)

  const parseJsonWithLocations = useCallback((text: string): ImportResult => {
    try {
      const parsed = JSON.parse(text)
      return { success: true, config: parsed }
    } catch (e) {
      const error = e as SyntaxError
      // Extract line/column from error message if possible
      const match = error.message.match(/position (\d+)/)
      let line = 1
      let column = 1

      if (match) {
        const position = parseInt(match[1])
        const lines = text.substring(0, position).split('\n')
        line = lines.length
        column = lines[lines.length - 1].length + 1
      }

      return {
        success: false,
        jsonErrors: [{
          line,
          column,
          message: error.message
        }]
      }
    }
  }, [])

  const addIdsToConfig = useCallback((config: any): TrunkRecorderConfig => {
    return {
      ...config,
      sources: (config.sources || []).map((s: any) => ({
        ...s,
        id: generateId()
      })) as ConfigSource[],
      systems: (config.systems || []).map((s: any) => ({
        ...s,
        id: generateId()
      })) as ConfigSystem[],
      plugins: (config.plugins || []).map((p: any) => ({
        ...p,
        id: generateId()
      })) as ConfigPlugin[]
    }
  }, [])

  const importFromText = useCallback(async (text: string): Promise<ImportResult> => {
    setIsImporting(true)

    // Step 1: Parse JSON
    const parseResult = parseJsonWithLocations(text)

    if (!parseResult.success) {
      setImportResult(parseResult)
      setIsImporting(false)
      return parseResult
    }

    // Step 2: Add internal IDs
    const configWithIds = addIdsToConfig(parseResult.config)

    // Step 3: Validate against schema
    const validationErrors = validate(configWithIds)

    const result: ImportResult = {
      success: true,
      config: configWithIds,
      schemaWarnings: validationErrors.map(e => ({
        path: e.path,
        message: e.message
      }))
    }

    setImportResult(result)
    setIsImporting(false)

    return result
  }, [parseJsonWithLocations, addIdsToConfig, validate])

  const importFromFile = useCallback(async (file: File): Promise<ImportResult> => {
    const text = await file.text()
    return importFromText(text)
  }, [importFromText])

  const acceptImport = useCallback(() => {
    if (importResult?.config) {
      setConfig(importResult.config)
      setImportResult(null)
    }
  }, [importResult, setConfig])

  const cancelImport = useCallback(() => {
    setImportResult(null)
  }, [])

  return {
    importFromFile,
    importFromText,
    acceptImport,
    cancelImport,
    isImporting,
    importResult
  }
}
