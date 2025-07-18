import { type CSSProperties, useEffect, useState } from "react"

import { Form } from "antd"
import { debounce } from "lodash-es"
import { toast } from "sonner"
import styleToObject from "style-to-object"

import { Input as YuInput } from "@/components/ui/input"
import { type Dimension, SizeInput } from "@/components/ui/sizeInput"
import { type ComponentSetter, useComponentConfigStore } from "@/editor/stores/componentsConfig"
import { useEditorStore } from "@/editor/stores/useEditorStore"
import { DEFAULT_UNITS } from "@/utils"
import { parseSizeValue, stringifySizeValue } from "@/utils/styleParser"

import { ShadcnSelectAdapter } from "../ShadcnSelectAdapter"
import { CustomCssDialog } from "./components/CustomCssDialog"

// 工具函数：解析组件样式 → 表单可用值
function parseStyleForForm(style: CSSProperties = {}): Record<string, any> {
  const result: Record<string, any> = {}

  for (const [key, val] of Object.entries(style)) {
    if ((key === "width" || key === "height") && typeof val === "string") {
      result[key] = parseSizeValue(val)
    } else {
      result[key] = val
    }
  }
  return result
}

// 工具函数：将表单值 → 样式对象
function normalizeStyleFromForm(values: Record<string, any>): Record<string, any> {
  const style: Record<string, any> = {}
  for (const key in values) {
    const val = values[key]
    if (val && typeof val === "object" && "value" in val && "unit" in val) {
      style[key] = stringifySizeValue(val)
    } else {
      style[key] = val
    }
  }
  return style
}

// 工具函数：转为 .comp {...} 字符串
function toCssStr(css: Record<string, any>): string {
  let str = `.comp{\n`
  for (const key in css) {
    let value = css[key]
    if (!value) continue
    if ((key === "width" || key === "height") && typeof value === "string" && !DEFAULT_UNITS.some((unit) => value.endsWith(unit))) {
      value += DEFAULT_UNITS[0]
    }
    str += `  ${key}: ${value};\n`
  }
  str += `}`
  return str
}

export function Styles() {
  const [form] = Form.useForm()
  const { currentComponentId, currentComponent, updateComponentStyle } = useEditorStore()
  const { componentConfig } = useComponentConfigStore()
  const [css, setCss] = useState<CSSProperties>({})
  const [open, setOpen] = useState(false)

  // 解析 CSS 字符串为对象
  const handleCssChange = debounce((value: string) => {
    try {
      const cleaned = value
        .replace(/\/\*.*\*\//, "")
        .replace(/(\.?[^{]+{)/, "")
        .replace("}", "")
      const parsed: Record<string, any> = {}
      styleToObject(cleaned, (name, value) => {
        parsed[name.replace(/-\w/, (m) => m[1].toUpperCase())] = value
      })
      setCss(parsed)
    } catch (error) {
      console.warn("CSS 解析失败", error)
    }
  }, 500)

  // 同步 currentComponent → 表单初始值
  useEffect(() => {
    if (!currentComponent) return
    form.resetFields()
    const formData = parseStyleForForm(currentComponent.style || {})
    setCss(currentComponent.style || {})
    form.setFieldsValue(formData)
  }, [currentComponent])

  // 表单变更 → 更新样式
  const handleFormChange = (changed: Record<string, any>) => {
    if (!currentComponentId) return
    const style = normalizeStyleFromForm(changed)
    updateComponentStyle(currentComponentId, style)
    setCss((prevCss) => ({ ...prevCss, ...style }))
  }

  // 提交自定义 CSS 字符串
  const handleCssSubmit = () => {
    if (!css || typeof css !== "object") {
      toast.error("请输入正确的 CSS")
      return
    }
    updateComponentStyle(currentComponentId!, css, true)
    form.setFieldsValue(parseStyleForForm(css))
    setOpen(false)
  }

  // 渲染组件表单项
  const renderFormElement = (setting: ComponentSetter) => {
    const { renderType, options, name, defaultValue } = setting
    const itemValue = form.getFieldValue(name)
    console.log(itemValue, "tt")

    if (renderType === "select") {
      return <ShadcnSelectAdapter value={itemValue ?? ""} onChange={(v) => form.setFieldValue(name, v)} options={options || []} placeholder={defaultValue ?? "请选择"} />
    } else if (renderType === "input") {
      return <YuInput value={itemValue ?? ""} onChange={(e) => form.setFieldValue(name, e.target.value)} />
    } else if (renderType === "inputNumber") {
      const raw: any = currentComponent?.style?.[name as keyof CSSProperties]
      const value = parseSizeValue(raw, ["px", "%"])
      return <SizeInput dimension={name as Dimension} value={value} units={setting.unitOptions} onChange={(val) => form.setFieldsValue({ [name]: val })} />
    }
    return <div>不支持的控件类型</div>
  }

  if (!currentComponentId || !currentComponent) return null

  return (
    <div className="space-y-6 border-b p-4">
      <h2 className="text-muted-foreground text-sm font-medium">样式</h2>
      <Form form={form} className="space-y-4" style={{ width: "100%" }} labelCol={{ span: 4 }} wrapperCol={{ span: 40 }} onValuesChange={handleFormChange}>
        {componentConfig[currentComponent.name]?.styleSetter?.map((setter) => (
          <Form.Item key={setter.name} name={setter.name} label={setter.label}>
            {renderFormElement(setter)}
          </Form.Item>
        ))}
        <Form.Item label="自定义css" labelCol={{ span: 4 }} wrapperCol={{ span: 40 }}>
          <div className="flex h-full w-full items-center justify-end">
            <CustomCssDialog value={toCssStr(css)} onChange={handleCssChange} handleSubmit={handleCssSubmit} open={open} openChange={setOpen} />
          </div>
        </Form.Item>
      </Form>
    </div>
  )
}
