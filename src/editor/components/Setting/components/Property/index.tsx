import { useMemo } from "react"

import { Form } from "antd"

import { Input as YuInput } from "@/components/ui/input"
import { type ComponentConfig, type ComponentSetter, useComponentConfigStore } from "@/editor/stores/componentsConfig"
import { useEditorStore } from "@/editor/stores/useEditorStore"

import { ShadcnSelectAdapter } from "../ShadcnSelectAdapter"

export function Property() {
  const [form] = Form.useForm()

  const { currentComponentId, currentComponent, updateComponent } = useEditorStore()
  const { componentConfig } = useComponentConfigStore()

  const setters = componentConfig[currentComponent?.name || ""]?.setter || []

  /** 给 form 表单初始值 确保表单字段不会出现 undefined */
  const initialValues = useMemo(() => {
    const merged = {
      ...currentComponent?.style,
      ...currentComponent?.props,
    }

    for (const setter of setters) {
      if (merged[setter.name] === undefined) {
        merged[setter.name] = setter.defaultValue ?? ""
      }
    }

    return merged
  }, [currentComponent, setters])

  function renderFormElement(setting: ComponentSetter) {
    const { renderType, options, name, defaultValue } = setting
    const value = form.getFieldValue(name)

    if (renderType === "select") {
      return <ShadcnSelectAdapter value={value ?? ""} onChange={(v) => form.setFieldValue(name, v)} options={options || []} placeholder={defaultValue ?? "请选择"} />
    }

    if (renderType === "input") {
      return <YuInput value={value ?? ""} onChange={(e) => form.setFieldValue(name, e.target.value)} />
    }

    return <div>不支持的控件类型</div>
  }

  function valueChange(changeValues: ComponentConfig) {
    if (currentComponentId) {
      updateComponent(currentComponentId, changeValues)
    }
  }

  if (!currentComponentId || !currentComponent) return null

  return (
    <div className="space-y-6 border-b p-4">
      <h2 className="text-muted-foreground text-sm font-medium">{currentComponent.desc}</h2>
      <Form style={{ width: "100%" }} className="space-y-4" form={form} onValuesChange={valueChange} initialValues={initialValues} labelCol={{ span: 4 }} wrapperCol={{ span: 40 }}>
        <Form.Item label="组件id">
          <YuInput value={currentComponent.id} disabled />
        </Form.Item>
        <Form.Item label="组件名称">
          <YuInput value={currentComponent.name} disabled />
        </Form.Item>
        <Form.Item label="组件描述">
          <YuInput value={currentComponent.desc} disabled />
        </Form.Item>
        {setters.map((setter) => (
          <Form.Item key={setter.name} name={setter.name} label={setter.label}>
            {renderFormElement(setter)}
          </Form.Item>
        ))}
      </Form>
    </div>
  )
}
