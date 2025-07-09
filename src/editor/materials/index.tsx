import { useMemo } from "react";
import { useComponentConfigStore } from "@/editor/stores/componentsConfig";
import { MaterialItem } from "./components/MaterialItem";

export function MaterialComponentsList() {
    const { componentConfig } = useComponentConfigStore();

    const components = useMemo(() => {
        return Object.values(componentConfig);
    }, [componentConfig]);
    return <div className="p-4 text-sm text-gray-800">
        <p className="font-semibold mb-2">组件列表</p>
        <ul className="space-y-2">
            {components.map((item, index) => (
                <MaterialItem key={item.name + index} name={item.name}></MaterialItem>
            ))}
        </ul>
    </div>
}
