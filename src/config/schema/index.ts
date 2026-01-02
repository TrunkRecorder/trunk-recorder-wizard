import { globalSchema } from './global.schema'
import { sourceSchema } from './source.schema'
import { systemSchema } from './system.schema'
import {
  pluginBaseSchema,
  rdioScannerPluginSchema,
  simpleStreamPluginSchema
} from './plugin.schema'
import type { SchemaSection, FieldDefinition } from './types'

export const schemas = {
  global: globalSchema,
  source: sourceSchema,
  system: systemSchema,
  plugin: pluginBaseSchema,
  plugins: {
    rdioscanner_uploader: rdioScannerPluginSchema,
    simplestream: simpleStreamPluginSchema,
  }
} as const

export function getSchemaForSection(section: keyof Omit<typeof schemas, 'plugins'>): SchemaSection {
  return schemas[section] as SchemaSection
}

export function getPluginSchema(pluginName: string): SchemaSection | null {
  const key = pluginName as keyof typeof schemas.plugins
  return schemas.plugins[key] || null
}

export function getFieldDefinition(
  section: keyof Omit<typeof schemas, 'plugins'>,
  fieldKey: string
): FieldDefinition | undefined {
  const schema = getSchemaForSection(section)
  return schema.fields.find(f => f.key === fieldKey)
}

export * from './types'
export { globalSchema, sourceSchema, systemSchema, pluginBaseSchema }
