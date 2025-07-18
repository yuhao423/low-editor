import { ChevronUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { DEFAULT_UNITS, type UnitType } from "@/utils/index"

export type Dimension = "width" | "height"
export interface SizeInputValue {
  value: string
  unit: UnitType
}

export interface SizeInputProps {
  value?: SizeInputValue
  dimension: Dimension
  units?: UnitType[]
  onChange: (val: any) => void
}

export function SizeInput({ value, dimension, units = DEFAULT_UNITS, onChange }: SizeInputProps) {
  const internalValue = value?.value ?? ""

  const internalUnit = value?.unit ?? units[0]

  const handleValueChange = (val: string) => {
    const num = val.replace(/[^\d]/g, "")
    onChange({ value: num, unit: internalUnit })
  }

  const handleUnitChange = (newUnit: UnitType) => {
    onChange({ value: value?.value ?? "", unit: newUnit })
  }

  return (
    <div className="relative w-full">
      <Input value={internalValue} onChange={(e) => handleValueChange(e.target.value)} placeholder={`输入${dimension}`} className="pr-20" />

      <HoverCard openDelay={50} closeDelay={100}>
        <HoverCardTrigger asChild>
          <button
            type="button"
            className={cn(
              "absolute top-1/2 right-1 h-[calc(100%-8px)] -translate-y-1/2 rounded px-2 text-xs font-medium outline-none",
              "text-muted-foreground hover:bg-muted hover:text-primary flex items-center space-x-1 transition-colors",
            )}
            title="选择单位"
          >
            <span>{internalUnit}</span>
            <ChevronUp className="h-3 w-3" />
          </button>
        </HoverCardTrigger>
        <HoverCardContent className="w-24 p-2">
          <div className="flex flex-col space-y-1">
            {units.map((u) => (
              <Button key={u} variant={u === internalUnit ? "default" : "ghost"} size="sm" className="justify-start text-xs" onClick={() => handleUnitChange(u)}>
                {u}
              </Button>
            ))}
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  )
}
