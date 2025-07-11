import { create } from 'zustand';
import { Container } from '@/editor/materials/Container';
import { Button, meta } from '@/editor/materials/Button';
import Page from '@/editor/materials/Page';

/** 组件分类的类型 */
export type ComponentType = 'Layout' | 'Form' | 'Display' | 'Other';

export interface ComponentSetter {
    /** 字段名 */
    name: string,
    /** 表单类型 */
    renderType: string;
    /** 前面的文案 */
    label: string;
    [key: string]: any
}
export interface ComponentConfig {
    name: string;
    defaultProps: Record<string, any>,
    component: any,
    type: ComponentType;
    desc: string;
    setter?: ComponentSetter[]
}

interface State {
    componentConfig: { [key: string]: ComponentConfig };
}

interface Action {
    registerComponent: (name: string, componentConfig: ComponentConfig) => void
}
export const useComponentConfigStore = create<State & Action>((set) => ({
    componentConfig: {
        Container: {
            name: 'Container',
            defaultProps: {},
            component: Container,
            type: 'Layout',
            desc: '容器组件',
        },
        Button: {
            name: 'Button',
            defaultProps: {
                variant: meta.setter.find(item=>item.name === 'variant')?.defaultBtnType,
                text: meta.setter.find(item=>item.name === 'variant')?.defaultText
            },
            type: 'Form',
            desc: '按钮组件',
            setter: meta.setter,
            component: Button
        },
        Page: {
            name: 'Page',
            defaultProps: {},
            component: Page,
            type: 'Display',
            desc: '根组件'
        }
    },
    registerComponent: (name, componentConfig) => set((state) => {
        return {
            ...state,
            componentConfig: {
                ...state.componentConfig,
                [name]: componentConfig
            }
        }
    })
}));