import { SchemaSection } from './types'

export const systemSchema: SchemaSection = {
  id: 'system',
  title: 'Radio System',
  description: 'Configuration for a trunked or conventional radio system',
  fields: [
    {
      key: 'shortName',
      type: 'string',
      label: 'Short Name',
      description: 'A unique identifier for this system (4-6 characters recommended). Used in filenames and API calls.',
      required: false,
      minLength: 1,
      maxLength: 16,
      pattern: '^[a-zA-Z0-9_-]+$',
      placeholder: 'mysys'
    },
    {
      key: 'type',
      type: 'select',
      label: 'System Type',
      description: 'The type of radio system.',
      required: true,
      options: [
        { value: 'p25', label: 'P25 Trunked' },
        { value: 'smartnet', label: 'SmartNet/SmartZone Trunked' },
        { value: 'conventional', label: 'Conventional (Analog)' },
        { value: 'conventionalDMR', label: 'Conventional DMR' },
        { value: 'conventionalP25', label: 'Conventional P25' },
        { value: 'conventionalSIGMF', label: 'Conventional SigMF' }
      ]
    },
    {
      key: 'enabled',
      type: 'boolean',
      label: 'Enabled',
      description: 'Enable or disable this system.',
      required: false,
      default: true
    },
    // Trunked system fields
    {
      key: 'control_channels',
      type: 'array',
      label: 'Control Channels',
      description: 'List of control channel frequencies in Hz. Multiple frequencies provide redundancy.',
      required: true,
      itemType: 'frequency',
      minItems: 1,
      conditions: [
        { field: 'type', operator: 'in', value: ['p25', 'smartnet'] }
      ]
    },
    {
      key: 'modulation',
      type: 'select',
      label: 'Modulation',
      description: 'Control channel modulation type.',
      required: false,
      default: 'qpsk',
      options: [
        { value: 'qpsk', label: 'QPSK (Most P25 systems)' },
        { value: 'fsk4', label: 'FSK4/C4FM (Some older systems)' }
      ],
      conditions: [
        { field: 'type', operator: 'in', value: ['p25', 'smartnet'] }
      ]
    },
    // Conventional system fields
    {
      key: 'channels',
      type: 'array',
      label: 'Channel Frequencies',
      description: 'List of channel frequencies in Hz to monitor. Use this OR channelFile, not both.',
      required: false,
      itemType: 'frequency',
      minItems: 1,
      conditions: [
        { field: 'type', operator: 'in', value: ['conventional', 'conventionalDMR', 'conventionalP25', 'conventionalSIGMF'] }
      ]
    },
    {
      key: 'channelFile',
      type: 'string',
      label: 'Channel File',
      description: 'Path to CSV file defining channels. Use this OR channels array, not both.',
      required: false,
      conditions: [
        { field: 'type', operator: 'in', value: ['conventional', 'conventionalDMR', 'conventionalP25', 'conventionalSIGMF'] }
      ]
    },
    {
      key: 'squelch',
      type: 'number',
      label: 'Squelch Level (dB)',
      description: 'Squelch threshold in dB. Typical values: -40 to -60. More negative = more sensitive.',
      required: true,
      default: -50,
      min: -100,
      max: 0,
      conditions: [
        { field: 'type', operator: 'in', value: ['conventional', 'conventionalDMR', 'conventionalP25', 'conventionalSIGMF'] }
      ]
    },
    // SmartNet specific fields
    {
      key: 'bandplan',
      type: 'select',
      label: 'Band Plan',
      description: 'Frequency band plan for SmartNet systems.',
      required: false,
      default: '800_standard',
      options: [
        { value: '800_standard', label: '800 MHz Standard' },
        { value: '800_reband', label: '800 MHz Rebanded' },
        { value: '800_splinter', label: '800 MHz Splinter' },
        { value: '400_custom', label: '400 MHz Custom' }
      ],
      conditions: [
        { field: 'type', operator: 'eq', value: 'smartnet' }
      ]
    },
    {
      key: 'bandplanBase',
      type: 'frequency',
      label: 'Band Plan Base Frequency',
      description: 'Base frequency for custom 400 MHz band plan.',
      required: true,
      conditions: [
        { field: 'type', operator: 'eq', value: 'smartnet' },
        { field: 'bandplan', operator: 'eq', value: '400_custom' }
      ]
    },
    {
      key: 'bandplanHigh',
      type: 'frequency',
      label: 'Band Plan High Frequency',
      description: 'Highest channel frequency for band plan.',
      required: false,
      conditions: [
        { field: 'type', operator: 'eq', value: 'smartnet' }
      ]
    },
    {
      key: 'bandplanSpacing',
      type: 'number',
      label: 'Channel Spacing (Hz)',
      description: 'Spacing between channels. Typically 25000 Hz.',
      required: false,
      default: 25000,
      conditions: [
        { field: 'type', operator: 'eq', value: 'smartnet' },
        { field: 'bandplan', operator: 'eq', value: '400_custom' }
      ]
    },
    {
      key: 'bandplanOffset',
      type: 'number',
      label: 'Band Plan Offset',
      description: 'Offset value for frequency calculation.',
      required: false,
      conditions: [
        { field: 'type', operator: 'eq', value: 'smartnet' },
        { field: 'bandplan', operator: 'eq', value: '400_custom' }
      ]
    },
    // Common optional fields
    {
      key: 'talkgroupsFile',
      type: 'string',
      label: 'Talkgroups File',
      description: 'Path to CSV file with talkgroup definitions. Provides names and recording priorities.',
      required: false,
      placeholder: 'talkgroups.csv'
    },
    {
      key: 'unitTagsFile',
      type: 'string',
      label: 'Unit Tags File',
      description: 'Path to CSV file mapping unit IDs to names.',
      required: false,
      placeholder: 'unit_tags.csv'
    },
    {
      key: 'customFrequencyTableFile',
      type: 'string',
      label: 'Custom Frequency Table File',
      description: 'Path to CSV with custom frequency tables (P25).',
      required: false,
      placeholder: 'freq_table.csv',
      advanced: true,
      conditions: [
        { field: 'type', operator: 'eq', value: 'p25' }
      ]
    },
    // Upload configuration
    {
      key: 'apiKey',
      type: 'string',
      label: 'OpenMHz API Key',
      description: 'API key for OpenMHz uploads. Required if uploadServer is configured globally.',
      required: false,
      group: 'upload'
    },
    {
      key: 'openmhzSystemId',
      type: 'string',
      label: 'OpenMHz System ID',
      description: 'System ID for OpenMHz. Defaults to shortName if not specified.',
      required: false,
      group: 'upload'
    },
    {
      key: 'broadcastifyApiKey',
      type: 'string',
      label: 'Broadcastify API Key',
      description: 'API key for Broadcastify Calls uploads.',
      required: false,
      group: 'upload'
    },
    {
      key: 'broadcastifySystemId',
      type: 'number',
      label: 'Broadcastify System ID',
      description: 'Your system ID on Broadcastify Calls.',
      required: false,
      min: 1,
      group: 'upload'
    },
    {
      key: 'uploadScript',
      type: 'string',
      label: 'Upload Script',
      description: 'Path to custom upload script to run after recording.',
      required: false,
      placeholder: '/path/to/upload.sh',
      group: 'upload',
      advanced: true
    },
    // Recording options
    {
      key: 'audioArchive',
      type: 'boolean',
      label: 'Archive Audio',
      description: 'Keep audio files after upload.',
      required: false,
      default: true,
      group: 'recording'
    },
    {
      key: 'transmissionArchive',
      type: 'boolean',
      label: 'Transmission Archive',
      description: 'Keep individual transmission files (not just complete calls).',
      required: false,
      default: false,
      group: 'recording',
      advanced: true
    },
    {
      key: 'callLog',
      type: 'boolean',
      label: 'Call Log',
      description: 'Save JSON metadata for each call.',
      required: false,
      default: true,
      group: 'recording'
    },
    {
      key: 'compressWav',
      type: 'boolean',
      label: 'Compress Audio',
      description: 'Convert WAV files to M4A for smaller file sizes.',
      required: false,
      default: true,
      group: 'recording'
    },
    {
      key: 'recordUnknown',
      type: 'boolean',
      label: 'Record Unknown Talkgroups',
      description: 'Record talkgroups not in the talkgroups file.',
      required: false,
      default: true,
      group: 'recording'
    },
    {
      key: 'hideEncrypted',
      type: 'boolean',
      label: 'Hide Encrypted',
      description: 'Hide encrypted calls from logs.',
      required: false,
      default: false,
      group: 'recording',
      advanced: true
    },
    {
      key: 'hideUnknownTalkgroups',
      type: 'boolean',
      label: 'Hide Unknown Talkgroups',
      description: 'Hide unknown talkgroups from logs.',
      required: false,
      default: false,
      group: 'recording',
      advanced: true
    },
    {
      key: 'minDuration',
      type: 'number',
      label: 'Minimum Duration (seconds)',
      description: 'Minimum call duration to save. Shorter calls are discarded.',
      required: false,
      default: 0,
      min: 0,
      max: 3600,
      group: 'recording'
    },
    {
      key: 'minTransmissionDuration',
      type: 'number',
      label: 'Minimum Transmission Duration (seconds)',
      description: 'Minimum transmission duration to include in a call.',
      required: false,
      default: 0,
      min: 0,
      max: 60,
      group: 'recording',
      advanced: true
    },
    {
      key: 'maxDuration',
      type: 'number',
      label: 'Maximum Duration (seconds)',
      description: 'Maximum call duration. Calls longer than this will be split.',
      required: false,
      default: 0,
      min: 0,
      max: 36000,
      group: 'recording',
      advanced: true
    },
    {
      key: 'talkgroupDisplayFormat',
      type: 'select',
      label: 'Talkgroup Display Format',
      description: 'How talkgroups are displayed in logs and filenames.',
      required: false,
      default: 'id',
      options: [
        { value: 'id', label: 'ID only' },
        { value: 'id_tag', label: 'ID - Tag' },
        { value: 'tag_id', label: 'Tag (ID)' }
      ],
      group: 'recording',
      advanced: true
    },
    // Analog specific
    {
      key: 'analogLevels',
      type: 'number',
      label: 'Analog Levels',
      description: 'Audio amplification for analog channels (1-32). Higher = louder.',
      required: false,
      default: 8,
      min: 1,
      max: 32,
      conditions: [
        { field: 'type', operator: 'in', value: ['conventional', 'smartnet'] }
      ]
    },
    {
      key: 'maxDev',
      type: 'number',
      label: 'Maximum Deviation',
      description: 'Maximum frequency deviation for analog channels. Typically 5000 for NFM.',
      required: false,
      default: 5000,
      min: 1000,
      max: 15000,
      advanced: true,
      conditions: [
        { field: 'type', operator: 'in', value: ['conventional', 'smartnet'] }
      ]
    },
    {
      key: 'digitalLevels',
      type: 'number',
      label: 'Digital Levels',
      description: 'Audio amplification for digital channels (1-16).',
      required: false,
      default: 1,
      min: 1,
      max: 16
    },
    // Conventional decoders
    {
      key: 'decodeMDC',
      type: 'boolean',
      label: 'Decode MDC-1200',
      description: 'Enable MDC-1200 decoder for unit ID extraction.',
      required: false,
      default: false,
      conditions: [
        { field: 'type', operator: 'eq', value: 'conventional' }
      ]
    },
    {
      key: 'decodeFSync',
      type: 'boolean',
      label: 'Decode Fleet Sync',
      description: 'Enable Fleet Sync decoder.',
      required: false,
      default: false,
      conditions: [
        { field: 'type', operator: 'eq', value: 'conventional' }
      ]
    },
    {
      key: 'decodeStar',
      type: 'boolean',
      label: 'Decode Star',
      description: 'Enable Star decoder.',
      required: false,
      default: false,
      conditions: [
        { field: 'type', operator: 'eq', value: 'conventional' }
      ]
    },
    {
      key: 'decodeTPS',
      type: 'boolean',
      label: 'Decode TPS',
      description: 'Enable Motorola TPS decoder.',
      required: false,
      default: false,
      conditions: [
        { field: 'type', operator: 'eq', value: 'conventional' }
      ]
    },
    {
      key: 'deemphasisTau',
      type: 'number',
      label: 'De-emphasis Tau',
      description: 'De-emphasis constant. 0.000750 = 750µs for NFM.',
      required: false,
      default: 0.000750,
      min: 0,
      max: 0.001,
      step: 0.000001,
      advanced: true,
      conditions: [
        { field: 'type', operator: 'eq', value: 'conventional' }
      ]
    },
    {
      key: 'signalDetectorThreshold',
      type: 'number',
      label: 'Signal Detector Threshold',
      description: 'Static signal threshold (dB). Only set if needed.',
      required: false,
      min: -100,
      max: 0,
      advanced: true,
      conditions: [
        { field: 'type', operator: 'eq', value: 'conventional' }
      ]
    },
    // Multi-site
    {
      key: 'multiSite',
      type: 'boolean',
      label: 'Multi-Site Mode',
      description: 'Enable multi-site simulcast deduplication (experimental).',
      required: false,
      default: false,
      advanced: true,
      conditions: [
        { field: 'type', operator: 'in', value: ['p25', 'smartnet'] }
      ]
    },
    {
      key: 'multiSiteSystemName',
      type: 'string',
      label: 'Multi-Site System Name',
      description: 'Shared identifier for all sites in this system. Required for SmartNet multi-site.',
      required: true,
      conditions: [
        { field: 'type', operator: 'eq', value: 'smartnet' },
        { field: 'multiSite', operator: 'eq', value: true }
      ]
    },
    {
      key: 'multiSiteSystemNumber',
      type: 'number',
      label: 'Multi-Site System Number',
      description: 'Unique site number within the multi-site system.',
      required: false,
      default: 0,
      min: 0,
      max: 255,
      conditions: [
        { field: 'multiSite', operator: 'eq', value: true }
      ]
    }
  ]
}
