import { Form } from 'antd';
import { useEffect } from 'react';
import { type ComponentConfig, type ComponentSetter, useComponentConfigStore } from '@/editor/stores/componentsConfig';
import { useEditorStore } from '@/editor/stores/useEditorStore';
import {
    Select as ASlect,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
type Option<T = string> = { label: string; value: T };
import { Input as YuInput } from '@/components/ui/input';

/** shadcn/ui 只能处理string类型的value 写一个适配器  shadcn/ui 的select组件是不受控组件，而antd的form是受控的 */
export function ShadcnSelectAdapter<T extends string | number>({ value, onChange, options = [], defaultValue }: {
    value?: T;
    onChange?: (value: T) => void;
    options: Option<T>[];
    defaultValue?: string;
}) {
    return (
        <ASlect value={value?.toString()} onValueChange={(v) => onChange?.(v as T)} >
            <SelectTrigger  className="w-full">
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
    );
}

export function Property() {

    const [form] = Form.useForm();

    const { currentComponentId, currentComponent, updateComponent } = useEditorStore();
    const { componentConfig } = useComponentConfigStore();

    console.log();

    useEffect(() => {
        const data = form.getFieldsValue();
        form.setFieldsValue({ ...data, ...currentComponent?.props });
    }, [currentComponent])

    if (!currentComponentId || !currentComponent) return null;

    console.log(componentConfig[currentComponent.name].setter, currentComponent);

    function renderFormElement(setting: ComponentSetter) {
        const { renderType, options, name } = setting;

        if (renderType === 'select') {
            const defaultProps = componentConfig[currentComponent!.name]?.defaultProps;
            const defaValue = defaultProps?.[name]; // 注意不是写死 variant，要动态取
            const defaultLabel = options.find((item: { value: any; }) => item.value === defaValue)?.label ?? '请选择';

            return (
                <ShadcnSelectAdapter
                    options={options}
                    defaultValue={defaultLabel}
                />
            );
        } else if (renderType === 'input') {
            return <YuInput />
        } else {
            return <div>yu</div>
        }
    }


    function valueChange(changeValues: ComponentConfig) {
        if (currentComponentId) {
            updateComponent(currentComponentId, changeValues);
        }
    }

    return (
        <div className="p-4 space-y-6 border-b">
            <h2 className="text-sm font-medium text-muted-foreground">{currentComponent.desc}</h2>
            <Form
                style={{ width: '100%' }}
                className="space-y-4"
                form={form}
                onValuesChange={valueChange}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 40 }}
            >
                <Form.Item label="组件id">
                    <YuInput value={currentComponent.id} disabled />
                </Form.Item>
                <Form.Item label="组件名称">
                    <YuInput value={currentComponent.name} disabled />
                </Form.Item>
                <Form.Item label="组件描述">
                    <YuInput value={currentComponent.desc} disabled />
                </Form.Item>
                {
                    componentConfig[currentComponent.name]?.setter?.map(setter => (
                        <Form.Item key={setter.name} name={setter.name} label={setter.label}>
                            {renderFormElement(setter)}
                        </Form.Item>
                    ))
                }
            </Form>
        </div>
    )
}
