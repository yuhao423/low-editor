import { Select as ASlect, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'

export type Option<T = string> = { label: string; value: T }

/** Shadcn/ui 的 <Select /> 组件只接受 string 类型，所以要转换 .toString() */
export function ShadcnSelectAdapter<T extends string | number>({
  value,
  onChange,
  options = [],
  placeholder,
}: {
  value?: T
  onChange?: (value: T) => void
  options: Option<T>[]
  placeholder?: string
}) {
  return (
    <ASlect value={value?.toString() ?? ''} onValueChange={(v) => onChange?.(v as T)}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder ?? '请选择'} />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt.value.toString()} value={opt.value.toString()}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </ASlect>
  )
}
