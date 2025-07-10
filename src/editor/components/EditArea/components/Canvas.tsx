import React, { useState, type MouseEventHandler } from "react";
import { useCanvasStore } from "@/editor/stores/useCanvasStore";
import HoverMask from "./HoverMask";
import { useCurrentPage } from "@/editor/hooks/useCurrentPage";
import { useEditorStore, getComponentById } from "@/editor/stores/useEditorStore";


export function CanvasBox({ children }: { children?: React.ReactNode }) {
  const { position, size } = useCanvasStore();
  const { currentPageId } = useEditorStore()
  const [hoverComponentId, setHoverComponentId] = useState<string>()

  const page = useCurrentPage(currentPageId)
  /** 给每一个组件一个 dat-component-id 从当前鼠标元素到根元素找到第一个有dat-component-id的组件ID */
  const handleMouseOver: MouseEventHandler = (e) => {
    const path = e.nativeEvent.composedPath()
    for (let i = 0; i < path.length; i += 1) {
      const ele = path[i] as HTMLElement

      const componentId = ele.dataset?.componentId

      if (componentId) {
        setHoverComponentId(componentId)
        return
      }
    }
  }


  const hoverComponentName = hoverComponentId
    ? getComponentById(hoverComponentId, page?.components ?? [])?.name || hoverComponentId
    : page?.name;

  return (
    <div
      id="canvas-box" // 👈 供外层判断使用
      onMouseOver={handleMouseOver}
      onMouseLeave={() => {
        setHoverComponentId(undefined)
      }}
      className="absolute border border-gray-300 bg-white shadow-md cursor-default"
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
      }}
    >
      <div className="absolute left-0 -top-6 z-10 text-black text-sm  pointer-events-none">
        {hoverComponentName}
      </div>
      {hoverComponentId && (
        <HoverMask
          portalWrapperClassId="portal-wrapper"
          containerId="canvas-box"
          componentId={hoverComponentId}
        />
      )}
      <div id="portal-wrapper" className="portal-wrapper"></div>
      {children}
    </div>
  );
}
