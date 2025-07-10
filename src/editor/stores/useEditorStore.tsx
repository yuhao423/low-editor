import { create } from 'zustand';

export type ComponentType = 'Layout' | 'Form' | 'Display' | 'Other';

export interface Component {
  id: string;
  name: string;
  type?: ComponentType;
  props: Record<string, any> | any;
  children?: Component[];
  parentId?: string;
  desc?: string;
}

export interface Page {
  id: string;
  name: string;
  components: Component[];
}

interface State {
  pages: Page[];
  currentPageId: string;
  currentPage: Page | null;
  currentComponentId: string | null;
  /** 是点击的那一个组件 */
  currentComponent: Component | null;
  currentHoverComponentId: string | null | undefined;
  currentHoverComponent: Component | null;
}


/** 点击了一定高亮组件 但是高亮了不一定是点击选中的组件 */
interface Actions {
  setCurrentPage: (id: string) => void;
  addPage: (name?: string) => void;
  deletePage: (id: string) => void;
  addComponent: (component: Component, parentId?: string) => void;
  delComponent: (id: string) => void;
  updateComponent: (id: string, props: Record<string, any>) => void;
  setCurComponentId: (componentId: string | null) => void
  setCurHoverComponentId: (componentId: string | null) => void
}

export const useEditorStore = create<State & Actions>((set, get) => ({
  pages: [
    {
      id: 'page-1',
      name: '页面1',
      components: [
        {
          id: '1',
          name: 'Page',
          type: 'Display',
          props: {},
          desc: '页面组件',
        },
      ],
    },
  ],
  currentPageId: 'page-1',
  currentComponentId: null,
  currentComponent: null,
  currentHoverComponentId: null,
  currentHoverComponent: null,
  setCurrentPage: (id) => set({ currentPageId: id }),
  get currentPage() {
    const { pages, currentPageId } = get();
    return pages.find((p) => p.id === currentPageId) || null;
  },
  addPage: (name = '新页面') => {
    const newId = `page-${Date.now()}`;
    set((state) => ({
      pages: [
        ...state.pages,
        {
          id: newId,
          name,
          components: [
            {
              id: `${newId}-root`,
              name: 'Page',
              type: 'Display',
              props: {},
              desc: '页面组件',
            },
          ],
        },
      ],
      currentPageId: newId,
    }));
  },

  deletePage: (id) => {
    set((state) => {
      const remainingPages = state.pages.filter((p) => p.id !== id);
      const fallbackPage = remainingPages[0]?.id || '';
      return {
        pages: remainingPages,
        currentPageId: fallbackPage,
      };
    });
  },

  addComponent: (component, parentId) => {
    const { pages, currentPageId } = get();
    const updatedPages = pages.map((page) => {
      if (page.id !== currentPageId) return page;

      const root = page.components;
      if (!parentId) {
        return { ...page, components: [...root, component] };
      }

      const target = getComponentById(parentId, root);
      if (target) {
        if (!target.children) target.children = [];
        target.children.push(component);
        component.parentId = parentId;
      }

      return { ...page };
    });

    set({ pages: updatedPages });
  },

  delComponent: (id: string | null) => {
    const { pages, currentPageId } = get();
    const updatedPages = pages.map((page) => {
      if (page.id !== currentPageId) return page;

      const root = [...page.components];
      const newTree = removeComponentById(id, root);
      return { ...page, components: newTree };
    });

    set({ pages: updatedPages });
  },

  updateComponent: (id, props) => {
    const { pages, currentPageId } = get();
    const updatedPages = pages.map((page) => {
      if (page.id !== currentPageId) return page;

      const target = getComponentById(id, page.components);
      if (target) {
        target.props = { ...target.props, ...props };
      }

      return { ...page };
    });

    set({ pages: updatedPages });
  },
  setCurComponentId: (componentId) => {
    const page = get().pages.find(p => p.id === get().currentPageId);
    const targetComponent = componentId && page ? getComponentById(componentId, page.components) : null;
    
    set({
      currentComponentId: componentId,
      currentComponent: targetComponent,
    });
  },
  setCurHoverComponentId: (componentId) => {
    const page = get().pages.find(p => p.id === get().currentPageId);
    const targetComponent = componentId && page ? getComponentById(componentId, page.components) : null;

    set({
      currentHoverComponentId: componentId,
      currentHoverComponent: targetComponent,
    });
  },
}));

export function getComponentById(
  id: string,
  components: Component[]
): Component | null {
  for (const component of components) {
    if (component.id === id) return component;
    if (component.children?.length) {
      const found = getComponentById(id, component.children);
      if (found) return found;
    }
  }
  return null;
}

export function removeComponentById(id: string, components: Component[]): Component[] {
  return components
    .map((comp) => {
      if (comp.id === id) return null;
      if (comp.children) {
        comp.children = removeComponentById(id, comp.children);
      }
      return comp;
    })
    .filter(Boolean) as Component[];
}