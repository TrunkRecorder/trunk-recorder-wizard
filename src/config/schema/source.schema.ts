import { SchemaSection } from './types'

export const sourceSchema: SchemaSection = {
  id: 'source',
  title: 'SDR Source',
  description: 'Configuration for a Software Defined Radio device',
  fields: [
    {
      key: 'driver',
      type: 'select',
      label: 'Driver',
      description: 'SDR driver type. Use "osmosdr" for RTL-SDR, HackRF, AirSpy. Use "usrp" for Ettus USRP devices.',
      required: true,
      options: [
        { value: 'osmosdr', label: 'OsmoSDR (RTL-SDR, HackRF, AirSpy, etc.)' },
        { value: 'usrp', label: 'USRP (Ettus Research)' },
        { value: 'sigmffile', label: 'SigMF File' },
        { value: 'iqfile', label: 'IQ File' }
      ]
    },
    {
      key: 'device',
      type: 'string',
      label: 'Device Identifier',
      description: 'Device string in osmosdr format (e.g., "rtl=0" or "rtl=00000001" for serial). Only needed if using multiple devices.',
      required: false,
      placeholder: 'rtl=0',
      conditions: [
        { field: 'driver', operator: 'in', value: ['osmosdr', 'usrp'] }
      ]
    },
    {
      key: 'center',
      type: 'frequency',
      label: 'Center Frequency',
      description: 'Center frequency in Hz. Should be set to cover the channels you want to monitor without placing any channel at the exact center.',
      required: true,
      conditions: [
        { field: 'driver', operator: 'in', value: ['osmosdr', 'usrp', 'iqfile'] }
      ]
    },
    {
      key: 'rate',
      type: 'number',
      label: 'Sample Rate',
      description: 'Sample rate in samples per second. Common values: 2048000, 2400000, 8000000.',
      required: true,
      min: 240000,
      max: 20000000,
      placeholder: '2048000',
      conditions: [
        { field: 'driver', operator: 'in', value: ['osmosdr', 'usrp', 'iqfile'] }
      ]
    },
    {
      key: 'gain',
      type: 'number',
      label: 'RF Gain',
      description: 'RF gain setting. Optimal value depends on your SDR and antenna. Use GQRX to find a good value.',
      required: true,
      min: 0,
      max: 100,
      conditions: [
        { field: 'driver', operator: 'in', value: ['osmosdr', 'usrp'] }
      ]
    },
    {
      key: 'error',
      type: 'number',
      label: 'Frequency Error (Hz)',
      description: 'Frequency correction in Hz. Use this OR ppm, not both. Positive if SDR tunes high, negative if low.',
      required: false,
      default: 0,
      conditions: [
        { field: 'driver', operator: 'in', value: ['osmosdr', 'usrp'] }
      ]
    },
    {
      key: 'ppm',
      type: 'number',
      label: 'PPM Correction',
      description: 'Frequency correction in parts per million. Use this OR error (Hz), not both.',
      required: false,
      default: 0,
      conditions: [
        { field: 'driver', operator: 'in', value: ['osmosdr', 'usrp'] }
      ]
    },
    {
      key: 'agc',
      type: 'boolean',
      label: 'Automatic Gain Control',
      description: 'Enable automatic gain control. Not recommended for most applications.',
      required: false,
      default: false,
      advanced: true,
      conditions: [
        { field: 'driver', operator: 'in', value: ['osmosdr', 'usrp'] }
      ]
    },
    {
      key: 'digitalRecorders',
      type: 'number',
      label: 'Digital Recorders',
      description: 'Number of digital recorders for this source. Each recorder can capture one digital channel simultaneously.',
      required: false,
      min: 0,
      max: 32,
      default: 0
    },
    {
      key: 'analogRecorders',
      type: 'number',
      label: 'Analog Recorders',
      description: 'Number of analog recorders for this source. Each recorder can capture one analog channel simultaneously.',
      required: false,
      min: 0,
      max: 32,
      default: 0
    },
    {
      key: 'debugRecorders',
      type: 'number',
      label: 'Debug Recorders',
      description: 'Number of debug recorders for this source.',
      required: false,
      min: 0,
      max: 10,
      default: 0,
      advanced: true
    },
    {
      key: 'enabled',
      type: 'boolean',
      label: 'Enabled',
      description: 'Enable or disable this source.',
      required: false,
      default: true
    },
    // SigMF-specific fields
    {
      key: 'sigmfMeta',
      type: 'string',
      label: 'SigMF Metadata File',
      description: 'Path to the SigMF metadata file (.sigmf-meta).',
      required: true,
      conditions: [
        { field: 'driver', operator: 'eq', value: 'sigmffile' }
      ]
    },
    {
      key: 'sigmfData',
      type: 'string',
      label: 'SigMF Data File',
      description: 'Path to the SigMF data file (.sigmf-data).',
      required: true,
      conditions: [
        { field: 'driver', operator: 'eq', value: 'sigmffile' }
      ]
    },
    // IQ file specific
    {
      key: 'iqfile',
      type: 'string',
      label: 'IQ File Path',
      description: 'Path to the IQ recording file.',
      required: true,
      conditions: [
        { field: 'driver', operator: 'eq', value: 'iqfile' }
      ]
    },
    {
      key: 'repeat',
      type: 'boolean',
      label: 'Repeat Playback',
      description: 'Loop the file when it reaches the end.',
      required: false,
      default: false,
      conditions: [
        { field: 'driver', operator: 'in', value: ['sigmffile', 'iqfile'] }
      ]
    },
    // Advanced gain settings
    {
      key: 'ifGain',
      type: 'number',
      label: 'IF Gain',
      description: 'Intermediate frequency gain. For AirSpy and HackRF.',
      required: false,
      min: 0,
      max: 100,
      advanced: true,
      conditions: [
        { field: 'driver', operator: 'eq', value: 'osmosdr' }
      ]
    },
    {
      key: 'bbGain',
      type: 'number',
      label: 'Baseband Gain',
      description: 'Baseband gain. For HackRF.',
      required: false,
      min: 0,
      max: 100,
      advanced: true,
      conditions: [
        { field: 'driver', operator: 'eq', value: 'osmosdr' }
      ]
    },
    {
      key: 'mixGain',
      type: 'number',
      label: 'Mix Gain',
      description: 'Mixer gain. For AirSpy.',
      required: false,
      min: 0,
      max: 100,
      advanced: true,
      conditions: [
        { field: 'driver', operator: 'eq', value: 'osmosdr' }
      ]
    },
    {
      key: 'lnaGain',
      type: 'number',
      label: 'LNA Gain',
      description: 'Low-noise amplifier gain. For AirSpy and BladeRF.',
      required: false,
      min: 0,
      max: 100,
      advanced: true,
      conditions: [
        { field: 'driver', operator: 'eq', value: 'osmosdr' }
      ]
    },
    {
      key: 'vga1Gain',
      type: 'number',
      label: 'VGA1 Gain',
      description: 'VGA1 gain stage. For BladeRF.',
      required: false,
      min: 0,
      max: 100,
      advanced: true,
      conditions: [
        { field: 'driver', operator: 'eq', value: 'osmosdr' }
      ]
    },
    {
      key: 'vga2Gain',
      type: 'number',
      label: 'VGA2 Gain',
      description: 'VGA2 gain stage. For BladeRF.',
      required: false,
      min: 0,
      max: 100,
      advanced: true,
      conditions: [
        { field: 'driver', operator: 'eq', value: 'osmosdr' }
      ]
    },
    {
      key: 'antenna',
      type: 'string',
      label: 'Antenna Port',
      description: 'Antenna port selection (e.g., "TX/RX", "RX2"). USRP only.',
      required: false,
      placeholder: 'TX/RX',
      advanced: true,
      conditions: [
        { field: 'driver', operator: 'eq', value: 'usrp' }
      ]
    },
    {
      key: 'signalDetectorThreshold',
      type: 'number',
      label: 'Signal Detector Threshold',
      description: 'Static signal detector threshold in dB. Only set if needed.',
      required: false,
      min: -100,
      max: 0,
      advanced: true
    }
  ]
}
