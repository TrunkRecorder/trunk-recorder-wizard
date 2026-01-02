import { Switch } from '../ui/Switch'

interface BooleanFieldProps {
  label: string
  description: string
  value: boolean | undefined
  onChange: (value: boolean) => void
}

export function BooleanField({ label, description, value, onChange }: BooleanFieldProps) {
  return (
    <Switch
      label={label}
      description={description}
      checked={value ?? false}
      onCheckedChange={onChange}
    />
  )
}
