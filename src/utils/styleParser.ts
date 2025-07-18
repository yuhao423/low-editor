import type { UnitType } from "./index"
/** 默认支持的单位 */
import { DEFAULT_UNITS } from "./index"

/** 默认支持的单位 */

/** 解析样式值，比如 '200px' => { value: '200', unit: 'px' } */
export function parseSizeValue(raw?: string, allowedUnits: UnitType[] = DEFAULT_UNITS): { value: string; unit: UnitType } {
  if (!raw) return { value: "", unit: allowedUnits[0] }

  for (const unit of allowedUnits) {
    if (raw.endsWith(unit)) {
      return {
        value: raw.slice(0, -unit.length),
        unit,
      }
    }
  }

  const match = raw.match(/^(\d+)([a-zA-Z%]+)$/)
  if (match) {
    return {
      value: match[1],
      unit: match[2] as UnitType,
    }
  }

  return { value: raw, unit: allowedUnits[0] }
}

/** 将结构化值拼接成样式字符串，比如 { value: '200', unit: 'px' } => '200px' */
export function stringifySizeValue(val: { value: string; unit: string }): string {
  return `${val.value}${val.unit}`
}
