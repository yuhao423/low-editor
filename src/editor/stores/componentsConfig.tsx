import { create } from 'zustand';
import Container from '@/editor/materials/Container';
import Button from '@/editor/materials/Button';
import Page from '@/editor/materials/Page';

export type ComponentType = 'Layout' | 'Form' | 'Display' | 'Other';

export interface ComponentConfig {
    name: string;
    defaultProps: Record<string, any>,
    component: any,
    type: ComponentType;
    desc: string
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
            desc: '容器组件'
        },
        Button: {
            name: 'Button',
            defaultProps: {
                variant: 'default',
                text: '按钮'
            },
            type: 'Form',
            desc: '按钮组件',
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
