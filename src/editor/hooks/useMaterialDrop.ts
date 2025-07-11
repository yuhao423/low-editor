import { useDrop } from "react-dnd";
import { useEditorStore } from "@/editor/stores/useEditorStore";
import { useComponentConfigStore, type ComponentConfig } from "@/editor/stores/componentsConfig"
import { toast } from "sonner";

// 全局记录最后一次鼠标坐标
let lastMousePosition: { x: number, y: number } | null = null;

export function useMaterialDrop(accept: string[], id: string) {
    const { addComponent } = useEditorStore();
    const { componentConfig } = useComponentConfigStore();

    const [{ canDrop }, drop] = useDrop<unknown, unknown, { canDrop: boolean }>(() => ({
        accept,
        hover: (item, monitor) => {
            const offset = monitor.getClientOffset();
            if (offset) {
                lastMousePosition = { x: offset.x, y: offset.y };
            }
        },
        drop: (item, monitor) => {
            const didDrop = monitor.didDrop()
            if (didDrop) {
              return;
            }

            // 类型断言
            const componentItem = item as ComponentConfig;
            const props = componentConfig[componentItem.type].defaultProps;

            console.log(props,'ysbsbsbb');
            
            addComponent({
                id: `page-${Date.now()}`,
                name: componentItem.type,
                props,
                desc: componentItem.desc,
            }, id)

            toast(componentItem.type)

            // 用最后一次 hover 记录的鼠标坐标设置 hover 高亮
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                const { setCurHoverComponentId } = useEditorStore.getState();
                const offset = lastMousePosition;
                if (offset) {
                  let element = document.elementFromPoint(offset.x, offset.y);
                  while (element && !(element as HTMLElement).dataset?.componentId) {
                    element = (element as HTMLElement).parentElement;
                  }
                  if (element && (element as HTMLElement).dataset?.componentId) {
                    setCurHoverComponentId((element as HTMLElement).dataset.componentId ?? null);
                  }
                }
              });
            });
        },
        collect: (monitor) => ({
          canDrop: monitor.canDrop(),
        }),
    }));

    return { canDrop,  drop:drop as any }
}