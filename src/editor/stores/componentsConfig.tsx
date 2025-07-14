import { create } from 'zustand';
import { Container } from '@/editor/materials/Container';
import { Button, meta } from '@/editor/materials/Button';
import Page from '@/editor/materials/Page';

/** 组件分类的类型 */
export type ComponentType = 'Layout' | 'Form' | 'Display' | 'Other';

/** 映射用的 */
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
    styleSetter?: ComponentSetter[]
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
                variant: meta.setter.find(item => item.name === 'variant')?.defaultBtnType,
                text: meta.setter.find(item => item.name === 'variant')?.defaultText,
                width: getSetterItemAddUnit(meta.styleSetter, 'width', 'defaultWidth', 'defaultUnit'),
                height: getSetterItemAddUnit(meta.styleSetter, 'height', 'defaultHeight', 'defaultUnit')
            },
            type: 'Form',
            desc: '按钮组件',
            setter: meta.setter,
            styleSetter: meta.styleSetter,
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

/**
 * 根据 name 从 setter 或 styleSetter 中找到对应的配置项
 */
export function getSetterItem(setters: ComponentSetter[], name: string): ComponentSetter | undefined {
    return setters.find(s => s.name === name);
}

/**
 * 根据字段名，从 setters 中找到对应项，并返回默认值（拼接单位）
 * @param setters 组件配置数组
 * @param name 要查找的字段名
 * @param valueKey 默认值字段名，如 'defaultWidth'
 * @param unitKey 单位字段名，如 'defaultUnit'
 * @returns 拼接后的默认值字符串，如果没找到返回空字符串
 */
export function getSetterItemAddUnit(setters: ComponentSetter[], name: string, valueKey: string = 'defaultWidth', unitKey: string = 'defaultUnit'): string {
    const item = setters.find(s => s.name === name)
    if (!item) return ''

    const value = (item as any)[valueKey]
    const unit = (item as any)[unitKey]

    if (value !== undefined && unit) {
        return `${value}${unit}`
    }

    return ''
}

export function getDefaultValueFromSetter(item?: ComponentSetter): string {
    if (!item) return '';

    if ('defaultWidth' in item || 'defaultHeight' in item) {
        const width = item.defaultWidth ?? item.defaultHeight;
        const unit = item.defaultUnit ?? '';
        return width ? `${width}${unit}` : '';
    }

    const candidates = ['defaultValue', 'defaultText', 'defaultBtnType', 'default'];
    for (const key of candidates) {
        if (item[key]) return item[key];
    }

    return '';
}
