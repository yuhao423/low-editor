import { create } from 'zustand';
import Container from '@/editor/materials/Container';
import Button from '@/editor/materials/Button';
import Page from '@/editor/materials/Page';

export type ComponentType = 'Layout' | 'Form' | 'Display' | 'Other';
 
export interface ComponentConfig {
    name: string;
    defaultProps: Record<string, any>,
    component: any,
    type?: ComponentType;
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
            type:'Layout'
        },
        Button: {
            name: 'Button',
            defaultProps: {
                variant: 'default',
                text: '按钮'
            },
            type:'Form',
            component: Button
        },
        Page: {
            name: 'Page',
            defaultProps: {},
            component: Page,
            type:'Display'
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
