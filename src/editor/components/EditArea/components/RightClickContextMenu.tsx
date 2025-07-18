import { toast } from "sonner"

import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu"
import { useEditorStore } from "@/editor/stores/useEditorStore"

interface RightClickContextMenuProps {
  componentId: string
  children: React.ReactElement // 限制为单个 ReactElement
}

export function RightClickContextMenu({ children }: RightClickContextMenuProps) {
  // ✅ children 必须是单一 ReactElement，调用方保证这一点
  // 如有需要可以加操作逻辑，比如 useEditorStore
  const { delComponent, currentComponentId, setCurHoverComponentId, currentHoverComponentId } = useEditorStore()
  const handleContextMenu = () => {
    console.log(currentComponentId, "www")

    setCurHoverComponentId(currentHoverComponentId as any) // ✅ 右键时也设置选中
  }

  const handleDelete = () => {
    if (!currentComponentId) {
      toast.error("请先选中一个组件再删除")
      return
    }

    if (currentComponentId === currentHoverComponentId) {
      delComponent(currentComponentId)
      toast.success("组件已成功删除")
    } else {
      toast.warning("请选中想要删除的组件")
    }
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild onContextMenu={handleContextMenu}>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-32">
        <ContextMenuItem onClick={() => console.log("复制")}>复制</ContextMenuItem>
        <ContextMenuItem onClick={() => handleDelete()}>删除</ContextMenuItem>
        <ContextMenuItem onClick={() => console.log("上移")}>上移</ContextMenuItem>
        <ContextMenuItem onClick={() => console.log("下移")}>下移</ContextMenuItem>
        <ContextMenuItem onClick={() => console.log("刷新")}>刷新</ContextMenuItem>
        <ContextMenuItem onClick={() => handleDelete()}>删除</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
