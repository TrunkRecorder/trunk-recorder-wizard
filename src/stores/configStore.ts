import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface ConfigSource {
  id: string  // Internal tracking ID
  driver: string
  device?: string
  center?: number
  rate?: number
  gain?: number
  error?: number
  ppm?: number
  digitalRecorders?: number
  analogRecorders?: number
  debugRecorders?: number
  enabled?: boolean
  // SigMF fields
  sigmfMeta?: string
  sigmfData?: string
  repeat?: boolean
  // IQ file fields
  iqfile?: string
  // Advanced gain settings
  agc?: boolean
  ifGain?: number
  bbGain?: number
  mixGain?: number
  lnaGain?: number
  vga1Gain?: number
  vga2Gain?: number
  antenna?: string
  signalDetectorThreshold?: number
  [key: string]: unknown
}

export interface ConfigSystem {
  id: string  // Internal tracking ID
  shortName: string
  type: string
  enabled?: boolean
  // Trunked fields
  control_channels?: number[]
  modulation?: string
  // Conventional fields
  channels?: number[]
  channelFile?: string
  squelch?: number
  // SmartNet fields
  bandplan?: string
  bandplanBase?: number
  bandplanHigh?: number
  bandplanSpacing?: number
  bandplanOffset?: number
  // Common fields
  talkgroupsFile?: string
  unitTagsFile?: string
  customFrequencyTableFile?: string
  // Upload
  apiKey?: string
  openmhzSystemId?: string
  broadcastifyApiKey?: string
  broadcastifySystemId?: number
  uploadScript?: string
  // Recording
  audioArchive?: boolean
  transmissionArchive?: boolean
  callLog?: boolean
  compressWav?: boolean
  recordUnknown?: boolean
  hideEncrypted?: boolean
  hideUnknownTalkgroups?: boolean
  minDuration?: number
  minTransmissionDuration?: number
  maxDuration?: number
  talkgroupDisplayFormat?: string
  // Audio
  analogLevels?: number
  maxDev?: number
  digitalLevels?: number
  // Conventional decoders
  decodeMDC?: boolean
  decodeFSync?: boolean
  decodeStar?: boolean
  decodeTPS?: boolean
  deemphasisTau?: number
  signalDetectorThreshold?: number
  // Multi-site
  multiSite?: boolean
  multiSiteSystemName?: string
  multiSiteSystemNumber?: number
  [key: string]: unknown
}

export interface ConfigPlugin {
  id: string  // Internal tracking ID
  library: string
  name: string
  enabled?: boolean
  // Rdio Scanner fields
  server?: string
  systems?: Array<{
    shortName: string
    systemId: number
    apiKey: string
  }>
  // Simple Stream fields
  streams?: Array<{
    address: string
    port: number
    TGID: number
    shortName?: string
    sendJSON?: boolean
    sendCallStart?: boolean
    sendCallEnd?: boolean
    useTCP?: boolean
  }>
  [key: string]: unknown
}

export interface TrunkRecorderConfig {
  ver: number
  sources: ConfigSource[]
  systems: ConfigSystem[]
  plugins?: ConfigPlugin[]
  // Global settings
  defaultMode?: string
  tempDir?: string
  captureDir?: string
  callTimeout?: number
  uploadServer?: string
  broadcastifyCallsServer?: string
  broadcastifySslVerifyDisable?: boolean
  consoleLog?: boolean
  logFile?: boolean
  logDir?: string
  logLevel?: string
  frequencyFormat?: string
  audioStreaming?: boolean
  softVocoder?: boolean
  newCallFromUpdate?: boolean
  recordUUVCalls?: boolean
  controlWarnRate?: number
  controlRetuneLimit?: number
  statusAsString?: boolean
  statusServer?: string
  broadcastSignals?: boolean
  debugRecorder?: boolean
  debugRecorderPort?: number
  debugRecorderAddress?: string
  [key: string]: unknown
}

export interface ValidationError {
  path: string       // e.g., "systems[0].shortName"
  message: string
  severity: 'error' | 'warning'
}

interface ConfigState {
  // Current config being edited
  config: TrunkRecorderConfig

  // Validation state
  validationErrors: ValidationError[]

  // UI state
  isDirty: boolean
  selectedSection: 'global' | 'sources' | 'systems' | 'plugins' | 'validation'
  selectedItemId: string | null
  showAdvanced: boolean

  // Actions
  setConfig: (config: TrunkRecorderConfig) => void
  updateGlobal: (key: string, value: unknown) => void

  // Source actions
  addSource: () => void
  updateSource: (id: string, updates: Partial<ConfigSource>) => void
  removeSource: (id: string) => void
  reorderSources: (fromIndex: number, toIndex: number) => void

  // System actions
  addSystem: () => void
  updateSystem: (id: string, updates: Partial<ConfigSystem>) => void
  removeSystem: (id: string) => void
  reorderSystems: (fromIndex: number, toIndex: number) => void

  // Plugin actions
  addPlugin: () => void
  updatePlugin: (id: string, updates: Partial<ConfigPlugin>) => void
  removePlugin: (id: string) => void

  // Validation
  setValidationErrors: (errors: ValidationError[]) => void
  clearValidationErrors: () => void

  // UI actions
  setSelectedSection: (section: ConfigState['selectedSection']) => void
  setSelectedItemId: (id: string | null) => void
  setShowAdvanced: (show: boolean) => void

  // Reset
  resetConfig: () => void
  markClean: () => void
}

const generateId = () => crypto.randomUUID()

const defaultConfig: TrunkRecorderConfig = {
  ver: 2,
  sources: [],
  systems: [],
  plugins: []
}

const createDefaultSource = (): ConfigSource => ({
  id: generateId(),
  driver: 'osmosdr',
  center: 0,
  rate: 2048000,
  gain: 30,
  digitalRecorders: 2,
  enabled: true
})

const createDefaultSystem = (index: number): ConfigSystem => ({
  id: generateId(),
  shortName: `sys${index + 1}`,
  type: 'p25',
  enabled: true
})

const createDefaultPlugin = (): ConfigPlugin => ({
  id: generateId(),
  library: '',
  name: '',
  enabled: true
})

export const useConfigStore = create<ConfigState>()(
  persist(
    (set) => ({
      config: { ...defaultConfig },
      validationErrors: [],
      isDirty: false,
      selectedSection: 'global',
      selectedItemId: null,
      showAdvanced: false,

      setConfig: (config) => set({
        config,
        isDirty: false,
        validationErrors: []
      }),

      updateGlobal: (key, value) => set((state) => ({
        config: { ...state.config, [key]: value },
        isDirty: true
      })),

      addSource: () => set((state) => {
        const newSource = createDefaultSource()
        return {
          config: {
            ...state.config,
            sources: [...state.config.sources, newSource]
          },
          isDirty: true,
          selectedItemId: newSource.id,
          selectedSection: 'sources'
        }
      }),

      updateSource: (id, updates) => set((state) => ({
        config: {
          ...state.config,
          sources: state.config.sources.map(s =>
            s.id === id ? { ...s, ...updates } : s
          )
        },
        isDirty: true
      })),

      removeSource: (id) => set((state) => ({
        config: {
          ...state.config,
          sources: state.config.sources.filter(s => s.id !== id)
        },
        isDirty: true,
        selectedItemId: state.selectedItemId === id ? null : state.selectedItemId
      })),

      reorderSources: (fromIndex, toIndex) => set((state) => {
        const sources = [...state.config.sources]
        const [removed] = sources.splice(fromIndex, 1)
        sources.splice(toIndex, 0, removed)
        return {
          config: { ...state.config, sources },
          isDirty: true
        }
      }),

      addSystem: () => set((state) => {
        const newSystem = createDefaultSystem(state.config.systems.length)
        return {
          config: {
            ...state.config,
            systems: [...state.config.systems, newSystem]
          },
          isDirty: true,
          selectedItemId: newSystem.id,
          selectedSection: 'systems'
        }
      }),

      updateSystem: (id, updates) => set((state) => ({
        config: {
          ...state.config,
          systems: state.config.systems.map(s =>
            s.id === id ? { ...s, ...updates } : s
          )
        },
        isDirty: true
      })),

      removeSystem: (id) => set((state) => ({
        config: {
          ...state.config,
          systems: state.config.systems.filter(s => s.id !== id)
        },
        isDirty: true,
        selectedItemId: state.selectedItemId === id ? null : state.selectedItemId
      })),

      reorderSystems: (fromIndex, toIndex) => set((state) => {
        const systems = [...state.config.systems]
        const [removed] = systems.splice(fromIndex, 1)
        systems.splice(toIndex, 0, removed)
        return {
          config: { ...state.config, systems },
          isDirty: true
        }
      }),

      addPlugin: () => set((state) => {
        const newPlugin = createDefaultPlugin()
        return {
          config: {
            ...state.config,
            plugins: [...(state.config.plugins || []), newPlugin]
          },
          isDirty: true,
          selectedItemId: newPlugin.id,
          selectedSection: 'plugins'
        }
      }),

      updatePlugin: (id, updates) => set((state) => ({
        config: {
          ...state.config,
          plugins: (state.config.plugins || []).map(p =>
            p.id === id ? { ...p, ...updates } : p
          )
        },
        isDirty: true
      })),

      removePlugin: (id) => set((state) => ({
        config: {
          ...state.config,
          plugins: (state.config.plugins || []).filter(p => p.id !== id)
        },
        isDirty: true,
        selectedItemId: state.selectedItemId === id ? null : state.selectedItemId
      })),

      setValidationErrors: (errors) => set({ validationErrors: errors }),
      clearValidationErrors: () => set({ validationErrors: [] }),

      setSelectedSection: (section) => set({
        selectedSection: section,
        selectedItemId: null
      }),
      setSelectedItemId: (id) => set({ selectedItemId: id }),
      setShowAdvanced: (show) => set({ showAdvanced: show }),

      resetConfig: () => set({
        config: { ...defaultConfig },
        isDirty: false,
        validationErrors: [],
        selectedItemId: null
      }),

      markClean: () => set({ isDirty: false })
    }),
    {
      name: 'trunk-recorder-config',
      partialize: (state) => ({
        config: state.config,
        showAdvanced: state.showAdvanced
      })
    }
  )
)
