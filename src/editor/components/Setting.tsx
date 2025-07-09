import { useEditorStore } from "@/editor/stores/useEditorStore";
import { useMemo } from "react";



export const Setting = () => {

    const { currentPageId, pages } = useEditorStore()
    const page = useMemo(() => {
        return pages.find(item => item.id === currentPageId)
    }, [currentPageId, pages])
    return <div>
        <pre>
            {JSON.stringify(page, null, 2)}
        </pre> 
    </div>
}