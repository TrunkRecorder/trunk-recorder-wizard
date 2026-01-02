import { SchemaSection } from './types'

export const globalSchema: SchemaSection = {
  id: 'global',
  title: 'Global Settings',
  description: 'Top-level configuration options that apply to all systems',
  fields: [
    {
      key: 'ver',
      type: 'number',
      label: 'Config Version',
      description: 'Must be set to 2. Required for Trunk Recorder to start.',
      required: true,
      default: 2,
      min: 2,
      max: 2
    },
    {
      key: 'defaultMode',
      type: 'select',
      label: 'Default Mode',
      description: 'Recording mode for talkgroups not listed in the talkgroups file.',
      required: false,
      default: 'digital',
      options: [
        { value: 'digital', label: 'Digital' },
        { value: 'analog', label: 'Analog' }
      ]
    },
    {
      key: 'tempDir',
      type: 'string',
      label: 'Temp Directory',
      description: 'Directory for recording buffers. Defaults to /dev/shm on Linux or current directory on macOS.',
      required: false,
      placeholder: '/dev/shm'
    },
    {
      key: 'captureDir',
      type: 'string',
      label: 'Capture Directory',
      description: 'Directory where completed recordings are saved.',
      required: false,
      placeholder: '/home/user/recordings'
    },
    {
      key: 'callTimeout',
      type: 'number',
      label: 'Call Timeout',
      description: 'Seconds of inactivity before a call is considered complete and saved.',
      required: false,
      default: 3,
      min: 1,
      max: 30
    },
    {
      key: 'uploadServer',
      type: 'string',
      label: 'OpenMHz Upload Server',
      description: 'URL for OpenMHz upload endpoint (e.g., https://api.openmhz.com).',
      required: false,
      placeholder: 'https://api.openmhz.com'
    },
    {
      key: 'broadcastifyCallsServer',
      type: 'string',
      label: 'Broadcastify Calls Server',
      description: 'URL for Broadcastify Calls upload endpoint.',
      required: false,
      placeholder: 'https://api.broadcastify.com/calls'
    },
    {
      key: 'broadcastifySslVerifyDisable',
      type: 'boolean',
      label: 'Disable Broadcastify SSL Verify',
      description: 'Disable SSL certificate verification for Broadcastify uploads.',
      required: false,
      default: false,
      advanced: true
    },
    {
      key: 'consoleLog',
      type: 'boolean',
      label: 'Console Logging',
      description: 'Enable console logging output.',
      required: false,
      default: true
    },
    {
      key: 'logFile',
      type: 'boolean',
      label: 'File Logging',
      description: 'Enable file-based logging.',
      required: false,
      default: false
    },
    {
      key: 'logDir',
      type: 'string',
      label: 'Log Directory',
      description: 'Directory for log files.',
      required: false,
      default: 'logs/',
      placeholder: 'logs/',
      conditions: [
        { field: 'logFile', operator: 'eq', value: true }
      ]
    },
    {
      key: 'logLevel',
      type: 'select',
      label: 'Log Level',
      description: 'Verbosity of logging output.',
      required: false,
      default: 'info',
      options: [
        { value: 'trace', label: 'Trace (Most Verbose)' },
        { value: 'debug', label: 'Debug' },
        { value: 'info', label: 'Info (Default)' },
        { value: 'warning', label: 'Warning' },
        { value: 'error', label: 'Error' },
        { value: 'fatal', label: 'Fatal (Least Verbose)' }
      ],
      advanced: true
    },
    {
      key: 'frequencyFormat',
      type: 'select',
      label: 'Frequency Format',
      description: 'Display format for frequencies in logs and console.',
      required: false,
      default: 'exp',
      options: [
        { value: 'exp', label: 'Exponential' },
        { value: 'mhz', label: 'MHz' },
        { value: 'hz', label: 'Hz' }
      ],
      advanced: true
    },
    {
      key: 'audioStreaming',
      type: 'boolean',
      label: 'Audio Streaming',
      description: 'Enable audio streaming for plugins like simplestream. Required for streaming plugins.',
      required: false,
      default: false
    },
    {
      key: 'softVocoder',
      type: 'boolean',
      label: 'Software Vocoder',
      description: "Use OP25 software vocoder for P25 Phase 1. Useful if you don't have hardware vocoder support.",
      required: false,
      default: false,
      advanced: true
    },
    {
      key: 'newCallFromUpdate',
      type: 'boolean',
      label: 'New Call from Update',
      description: 'Allow UPDATE messages to start new calls.',
      required: false,
      default: true,
      advanced: true
    },
    {
      key: 'recordUUVCalls',
      type: 'boolean',
      label: 'Record Unit-to-Unit Calls',
      description: 'Record Unit-to-Unit Voice calls (P25 systems only).',
      required: false,
      default: true,
      advanced: true
    },
    {
      key: 'controlWarnRate',
      type: 'number',
      label: 'Control Channel Warning Rate',
      description: 'Decode rate threshold (per second) below which warnings are shown. Use -1 to always display warnings.',
      required: false,
      default: 10,
      min: -1,
      max: 100,
      advanced: true
    },
    {
      key: 'controlRetuneLimit',
      type: 'number',
      label: 'Control Channel Retune Limit',
      description: 'Maximum retune attempts for control channel. 0 = unlimited.',
      required: false,
      default: 0,
      min: 0,
      advanced: true
    },
    {
      key: 'statusAsString',
      type: 'boolean',
      label: 'Status as String',
      description: 'Display status values as strings instead of numeric codes.',
      required: false,
      default: true,
      advanced: true
    },
    {
      key: 'statusServer',
      type: 'string',
      label: 'Status Server',
      description: 'WebSocket URL for status updates.',
      required: false,
      placeholder: 'ws://localhost:3005',
      advanced: true
    },
    {
      key: 'broadcastSignals',
      type: 'boolean',
      label: 'Broadcast Signals',
      description: 'Broadcast decoded signals to status server.',
      required: false,
      default: true,
      advanced: true
    },
    {
      key: 'debugRecorder',
      type: 'boolean',
      label: 'Debug Recorder',
      description: 'Attach debug recorder to sources for monitoring.',
      required: false,
      default: true,
      advanced: true
    },
    {
      key: 'debugRecorderPort',
      type: 'number',
      label: 'Debug Recorder Port',
      description: 'Starting UDP port for debug recorders.',
      required: false,
      default: 1234,
      min: 1024,
      max: 65535,
      advanced: true,
      conditions: [
        { field: 'debugRecorder', operator: 'eq', value: true }
      ]
    },
    {
      key: 'debugRecorderAddress',
      type: 'string',
      label: 'Debug Recorder Address',
      description: 'Network address for debug monitoring.',
      required: false,
      default: '127.0.0.1',
      placeholder: '127.0.0.1',
      advanced: true,
      conditions: [
        { field: 'debugRecorder', operator: 'eq', value: true }
      ]
    }
  ]
}
