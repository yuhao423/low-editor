import { Form, Input, Select } from 'antd';
import { useEffect } from 'react';
import { type ComponentConfig, type ComponentSetter, useComponentConfigStore } from '@/editor/stores/componentsConfig';
import { useEditorStore } from '@/editor/stores/useEditorStore';

export function Property() {

    const [form] = Form.useForm();

    const { currentComponentId, currentComponent, updateComponent } = useEditorStore();
    const { componentConfig } = useComponentConfigStore();

    useEffect(() => {
        const data = form.getFieldsValue();
        form.setFieldsValue({ ...data, ...currentComponent?.props });
    }, [currentComponent])

    if (!currentComponentId || !currentComponent) return null;

    console.log(componentConfig[currentComponent.name].setter,currentComponent);

    function renderFormElement(setting: ComponentSetter) {
        const { renderType, options } = setting;
        console.log(options, 'ew');

        if (renderType === 'select') {
            return <Select options={options} />
        } else if (renderType === 'input') {
            return <Input />
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
                style={{width:'100%'}}
                className="space-y-4"
                form={form}
                onValuesChange={valueChange}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 40 }}
            >
                <Form.Item label="组件id">
                    <Input value={currentComponent.id} disabled />
                </Form.Item>
                <Form.Item label="组件名称">
                    <Input value={currentComponent.name} disabled />
                </Form.Item>
                <Form.Item label="组件描述">
                    <Input value={currentComponent.desc} disabled />
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
