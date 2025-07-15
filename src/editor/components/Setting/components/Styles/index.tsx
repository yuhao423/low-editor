import { Form } from 'antd'
import { useEffect, useState, type CSSProperties } from 'react'
import { type ComponentSetter, useComponentConfigStore } from '@/editor/stores/componentsConfig'
import { useEditorStore } from '@/editor/stores/useEditorStore'
import { Select as ASlect, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Input as YuInput } from '@/components/ui/input'
import { SizeInput, type Dimension } from '@/components/ui/sizeInput'
import { parseSizeValue, stringifySizeValue } from '@/utils/styleParser'
import { CustomCssDialog } from './components/CustomCssDialog'
import { debounce } from 'lodash-es'
import { DEFAULT_UNITS } from '@/utils'
import styleToObject from 'style-to-object'
import type { editor } from 'monaco-editor'
import { toast } from 'sonner'

type Option<T = string> = { label: string; value: T }
/** shadcn/ui 只能处理string类型的value 写一个适配器  shadcn/ui 的select组件是不受控组件，而antd的form是受控的 */
export function ShadcnSelectAdapter<T extends string | number>({
  value,
  onChange,
  options = [],
  defaultValue,
}: {
  value?: T
  onChange?: (value: T) => void
  options: Option<T>[]
  defaultValue?: string
}) {
  return (
    <ASlect value={value?.toString()} onValueChange={(v) => onChange?.(v as T)}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={defaultValue} />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value.toString()}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </ASlect>
  )
}

/** todo 单位的传入 组件大小变了没有更新 selectedMask 位置  自定义css更新之后没有更新表单和 selectedMask位置 */
export function Styles() {
  const [form] = Form.useForm()

  const { currentComponentId, currentComponent, updateComponentStyle } = useEditorStore()
  const { componentConfig } = useComponentConfigStore()

  const [css, setCss] = useState<CSSProperties | string | any>(() => currentComponent?.style ?? {})
  console.log(css, currentComponent, ' loading css')

  const [open, setOpen] = useState(false)

  const handleCssChange = debounce((value: string, ev: editor.IModelContentChangedEvent) => {
    console.log(value, ev)

    const css: Record<string, any> = {}
    try {
      const cssStr = value
        ?.replace(/\/\*.*\*\//, '') // 去掉注释 /** */
        .replace(/(\.?[^{]+{)/, '') // 去掉 .comp {
        .replace('}', '') // 去掉 }

      styleToObject(cssStr ?? '', (name, value) => {
        css[name.replace(/-\w/, (item) => item.toUpperCase().replace('-', ''))] = value
      })

      setCss(css)
    } catch (error) {
      console.log(error)
      //   setCss({})
    }
  }, 500)
  useEffect(() => {
    form.resetFields()
    const data = form.getFieldsValue()

    /** style:{width:'100%'} */
    const style: Record<string, any> = currentComponent?.style || {}
    const normalizedStyle = { ...style }

    /** 更新css */
    setCss(currentComponent?.style || {})

    if (typeof style.width === 'string') {
      normalizedStyle.width = parseSizeValue(style.width)
    }
    if (typeof style.height === 'string') {
      normalizedStyle.height = parseSizeValue(style.height)
    }

    form.setFieldsValue({
      ...data,
      ...normalizedStyle,
    } as any)
  }, [currentComponent])

  if (!currentComponentId || !currentComponent) return null

  function renderFormElement(setting: ComponentSetter) {
    const { renderType, options, name } = setting
    if (renderType === 'select') {
      const defaultProps = componentConfig[currentComponent!.name]?.defaultProps
      const defaValue = defaultProps?.[name] // 注意不是写死 variant，要动态取
      const defaultLabel = options.find((item: { value: any }) => item.value === defaValue)?.label ?? '请选择'

      return <ShadcnSelectAdapter options={options} defaultValue={defaultLabel} />
    } else if (renderType === 'input') {
      return <YuInput />
    } else {
      const rawStyleValue: any = currentComponent?.style?.[name as keyof CSSProperties]

      console.log(rawStyleValue, 'rawStyleValue')
      const res = parseSizeValue(rawStyleValue, ['px', '%'])
      console.log(res, 'res')

      return (
        <SizeInput
          units={setting.unitOptions}
          dimension={setting.name as Dimension}
          /** 这个value 一开始是字符串 传入的，更改了变成对象了，点击了组件又变成字符串 导致返显有问题 */
          value={res}
          onChange={(val) => form.setFieldsValue({ [name]: val })}
        />
      )
    }
  }

  function valueChange(changeValues: Record<string, any>) {
    if (!currentComponentId) return

    const style: Record<string, any> = {}
    for (const key in changeValues) {
      const val = changeValues[key]
      if (val && typeof val === 'object' && 'value' in val && 'unit' in val) {
        style[key] = stringifySizeValue(val)
      } else {
        style[key] = val
      }
    }

    updateComponentStyle(currentComponentId, style)
  }
  const handleCssSubmit = () => {
    if (css) {
      console.log(css, 'css')

      updateComponentStyle(currentComponentId!, css as CSSProperties, true)
      setOpen(false)
    } else {
      toast.error('请输入正确的css代码')
    }
  }

  function toCssStr(css: Record<string, any>) {
    console.log(css, '????')

    let str = `.comp{\n`
    for (const key in css) {
      let value = css[key]

      if (!value) continue
      if (['width', 'height'].includes(key) && typeof value === 'string' && !DEFAULT_UNITS.some((unit) => value.endsWith(unit))) {
        value += DEFAULT_UNITS[0]
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      str += `\t${key}: ${value};\n`
    }
    str += `}`

    return str
  }

  return (
    <div className="space-y-6 border-b p-4">
      <h2 className="text-muted-foreground text-sm font-medium">样式</h2>
      <Form style={{ width: '100%' }} className="space-y-4" form={form} onValuesChange={valueChange} labelCol={{ span: 4 }} wrapperCol={{ span: 40 }}>
        {componentConfig[currentComponent.name]?.styleSetter?.map((setter) => (
          <Form.Item key={setter.name} name={setter.name} label={setter.label}>
            {renderFormElement(setter)}
          </Form.Item>
        ))}
        <Form.Item
          label="自定义css"
          // 设置 label 和内容的比例（和上面保持一致或自定义）
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 40 }}
        >
          <div className="flex h-full w-full items-center justify-end">
            <CustomCssDialog value={toCssStr(css)} onChange={handleCssChange} handleSubmit={handleCssSubmit} open={open} openChange={setOpen} />
          </div>
        </Form.Item>
      </Form>
    </div>
  )
}
