import React, { useMemo, useRef, type MouseEventHandler } from 'react'
import { useCanvasStore } from '@/editor/stores/useCanvasStore'
import HoverMask from './HoverMask'
import { useCurrentPage } from '@/editor/hooks/useCurrentPage'
import { useEditorStore } from '@/editor/stores/useEditorStore'
import SelectedMask from './SelectedMask'

export function CanvasBox({ children }: { children?: React.ReactNode }) {
  const { position, size } = useCanvasStore()
  const { currentPageId, setCurComponentId, currentHoverComponentId, currentComponentId, setCurHoverComponentId, currentHoverComponent } = useEditorStore()
  const canvasBox = useRef<HTMLDivElement>(null)

  const page = useCurrentPage(currentPageId)
  /** 给每一个组件一个 dat-component-id 从当前鼠标元素到根元素找到第一个有dat-component-id的组件ID */
  const handleMouseOver: MouseEventHandler = (e) => {
    const path = e.nativeEvent.composedPath()
    for (let i = 0; i < path.length; i += 1) {
      const ele = path[i] as HTMLElement

      const componentId = ele.dataset?.componentId

      if (componentId) {
        setCurHoverComponentId(componentId)
        return
      }
    }
  }

  /** 点击的时候记录当前是点击的那个组件和组件id */
  const handleCanvasClick: MouseEventHandler = (e) => {
    const path = e.nativeEvent.composedPath()
    for (let i = 0; i < path.length; i += 1) {
      const ele = path[i] as HTMLElement

      const componentId = ele.dataset?.componentId

      if (componentId) {
        setCurComponentId(componentId)
        return
      }
    }
  }

  // const hoverComponentName = currentHoverComponentId ? currentHoverComponent?.name || currentHoverComponentId : page?.name

  const hoverComponentName = useMemo(() => {
    if (currentHoverComponent?.name === 'Page' || !currentHoverComponentId) return page?.name

    return currentHoverComponent?.name || currentHoverComponentId
  }, [currentHoverComponentId])

  const handleOnMouseLeave: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const relatedTarget = e.relatedTarget as HTMLElement | null

    // 如果鼠标还在 canvas 内，就不清空
    if (canvasBox?.current && relatedTarget && canvasBox.current?.contains(relatedTarget)) {
      return
    }

    setCurHoverComponentId(undefined as unknown as null)
  }

  return (
    <div
      id="canvas-box"
      ref={canvasBox}
      onMouseOver={handleMouseOver}
      onClick={handleCanvasClick}
      onMouseLeave={handleOnMouseLeave}
      className="absolute cursor-default border border-gray-300 bg-white shadow-md"
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
      }}
    >
      <div className="pointer-events-none absolute -top-6 left-0 z-10 text-sm text-black">{hoverComponentName}</div>

      {/* HoverMask 条件渲染 */}
      {currentHoverComponentId && <HoverMask portalWrapperClassId="portal-wrapper" containerId="canvas-box" componentId={currentHoverComponentId} />}

      {/* SelectedMask 只在 hover 和 selected 不同且都有值，或只有 selected 有值时显示 */}
      {currentComponentId && (!currentHoverComponentId || currentHoverComponentId !== currentComponentId) && (
        <SelectedMask portalWrapperClassId="portal-wrapper" containerId="canvas-box" componentId={currentComponentId} />
      )}

      <div id="portal-wrapper" className="portal-wrapper"></div>

      {children}
    </div>
  )
}
