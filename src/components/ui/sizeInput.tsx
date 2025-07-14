
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card"
import { ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { type UnitType, DEFAULT_UNITS } from '@/utils/index'


export type Dimension = "width" | "height"
export interface SizeInputValue {
  value: string;
  unit: UnitType;
}

export interface SizeInputProps {
  value?: SizeInputValue;
  dimension: Dimension;
  units?: UnitType[];
  onChange: (val: any) => void;
}

export function SizeInput({
  value,
  dimension,
  units = DEFAULT_UNITS,
  onChange,
}: SizeInputProps) {
  const internalValue = value?.value ?? '';

  const internalUnit = value?.unit ?? units[0];

  const handleValueChange = (val: string) => {
    const num = val.replace(/[^\d]/g, "");
    onChange({ value: num, unit: internalUnit });
  };

  const handleUnitChange = (newUnit: UnitType) => {
    onChange({ value: value?.value ?? '', unit: newUnit });
  };

  return (
    <div className="relative w-full">
      <Input
        value={internalValue}
        onChange={(e) => handleValueChange(e.target.value)}
        placeholder={`输入${dimension}`}
        className="pr-20"
      />

      <HoverCard openDelay={50} closeDelay={100}>
        <HoverCardTrigger asChild>
          <button
            type="button"
            className={cn(
              "absolute right-1 top-1/2 -translate-y-1/2 px-2 h-[calc(100%-8px)] rounded text-xs font-medium outline-none",
              "flex items-center space-x-1 text-muted-foreground hover:bg-muted hover:text-primary transition-colors"
            )}
            title="选择单位"
          >
            <span>{internalUnit}</span>
            <ChevronUp className="w-3 h-3" />
          </button>
        </HoverCardTrigger>
        <HoverCardContent className="w-24 p-2">
          <div className="flex flex-col space-y-1">
            {units.map((u) => (
              <Button
                key={u}
                variant={u === internalUnit ? "default" : "ghost"}
                size="sm"
                className="text-xs justify-start"
                onClick={() => handleUnitChange(u)}
              >
                {u}
              </Button>
            ))}
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}
