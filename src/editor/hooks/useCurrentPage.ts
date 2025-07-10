import { useEditorStore } from "@/editor/stores/useEditorStore";
import type { Page } from "@/editor/stores/useEditorStore";

export function useCurrentPage(pageId: string): Page | undefined {
    const { pages } = useEditorStore()
    return pages.find(item => item.id === pageId)
}