// 先定义允许的单位字符串字面量类型
export type UnitType = "px" | "%" | "vw" | "vh" | (string & {})

export const DEFAULT_UNITS: UnitType[] = ["px", "%", "vw", "vh"]
