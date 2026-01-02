import { SchemaSection } from './types'

export const pluginBaseSchema: SchemaSection = {
  id: 'plugin',
  title: 'Plugin',
  description: 'Plugin configuration',
  fields: [
    {
      key: 'library',
      type: 'string',
      label: 'Library',
      description: 'Plugin library filename (e.g., librdioscanner_uploader.so).',
      required: true,
      placeholder: 'libmyplugin.so'
    },
    {
      key: 'name',
      type: 'string',
      label: 'Plugin Name',
      description: 'Plugin name that matches the _plugin_new function.',
      required: true,
      placeholder: 'myplugin'
    },
    {
      key: 'enabled',
      type: 'boolean',
      label: 'Enabled',
      description: 'Enable or disable this plugin.',
      required: false,
      default: true
    }
  ]
}

// Plugin-specific schemas
export const rdioScannerPluginSchema: SchemaSection = {
  id: 'plugin_rdioscanner',
  title: 'Rdio Scanner Plugin',
  description: 'Upload recordings to Rdio Scanner',
  fields: [
    ...pluginBaseSchema.fields,
    {
      key: 'server',
      type: 'string',
      label: 'Server URL',
      description: 'URL of your Rdio Scanner instance.',
      required: true,
      placeholder: 'https://your-rdio-scanner.com'
    },
    {
      key: 'systems',
      type: 'array',
      label: 'Systems',
      description: 'Systems to upload to Rdio Scanner.',
      required: true,
      itemType: 'object',
      minItems: 1,
      itemSchema: [
        {
          key: 'shortName',
          type: 'string',
          label: 'System Short Name',
          description: "Must match a configured system's shortName.",
          required: true
        },
        {
          key: 'systemId',
          type: 'number',
          label: 'Rdio Scanner System ID',
          description: 'System ID in Rdio Scanner.',
          required: true,
          min: 1
        },
        {
          key: 'apiKey',
          type: 'string',
          label: 'API Key',
          description: 'API key for this system in Rdio Scanner.',
          required: true
        }
      ]
    }
  ]
}

export const simpleStreamPluginSchema: SchemaSection = {
  id: 'plugin_simplestream',
  title: 'Simple Stream Plugin',
  description: 'Stream audio over UDP/TCP',
  fields: [
    ...pluginBaseSchema.fields,
    {
      key: 'streams',
      type: 'array',
      label: 'Streams',
      description: 'Stream destinations.',
      required: true,
      itemType: 'object',
      minItems: 1,
      itemSchema: [
        {
          key: 'address',
          type: 'string',
          label: 'Address',
          description: 'IP address to stream to.',
          required: true,
          placeholder: '127.0.0.1'
        },
        {
          key: 'port',
          type: 'number',
          label: 'Port',
          description: 'Port number.',
          required: true,
          min: 1,
          max: 65535
        },
        {
          key: 'TGID',
          type: 'number',
          label: 'Talkgroup ID',
          description: 'Talkgroup to stream (0 = all).',
          required: true,
          default: 0,
          min: 0
        },
        {
          key: 'shortName',
          type: 'string',
          label: 'System Short Name',
          description: 'Limit to specific system (omit for all).',
          required: false
        },
        {
          key: 'sendJSON',
          type: 'boolean',
          label: 'Send JSON Metadata',
          description: 'Prepend JSON metadata to audio packets.',
          required: false,
          default: false
        },
        {
          key: 'sendCallStart',
          type: 'boolean',
          label: 'Send Call Start',
          description: 'Send JSON at call start.',
          required: false,
          default: false,
          conditions: [
            { field: 'sendJSON', operator: 'eq', value: true }
          ]
        },
        {
          key: 'sendCallEnd',
          type: 'boolean',
          label: 'Send Call End',
          description: 'Send JSON at call end.',
          required: false,
          default: false,
          conditions: [
            { field: 'sendJSON', operator: 'eq', value: true }
          ]
        },
        {
          key: 'useTCP',
          type: 'boolean',
          label: 'Use TCP',
          description: 'Use TCP instead of UDP.',
          required: false,
          default: false
        }
      ]
    }
  ]
}
