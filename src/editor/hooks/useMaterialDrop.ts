import { useDrop } from "react-dnd";
import { useEditorStore } from "@/editor/stores/useEditorStore";
import { useComponentConfigStore, type ComponentConfig } from "@/editor/stores/componentsConfig"
import { toast } from "sonner";

export function useMaterialDrop(accept: string[], id: string) {
    const { addComponent } = useEditorStore();
    const { componentConfig } = useComponentConfigStore();

    const [{ canDrop }, drop] = useDrop(() => ({
        accept,
        drop: (item: ComponentConfig, monitor) => {
            const didDrop = monitor.didDrop()
            if (didDrop) {
              return;
            }

            const props = componentConfig[item.type].defaultProps;

            addComponent({
                id: `page-${Date.now()}`,
                name: item.type,
                props,
                desc:item.desc,
            }, id)

            toast(item.type)
        },
        collect: (monitor) => ({
          canDrop: monitor.canDrop(),
        }),
    }));

    return { canDrop,  drop:drop as any }
}
