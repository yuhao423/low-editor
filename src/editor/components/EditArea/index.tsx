import React, { useRef, useEffect } from "react";
import { CanvasBox } from "./components/Canvas";
import { useCanvasStore } from "@/editor/stores/useCanvasStore";
import { useComponentConfigStore } from "@/editor/stores/componentsConfig";
import { useEditorStore, type Component } from "@/editor/stores/useEditorStore";

export function EditArea() {
  const { pages, currentPageId } = useEditorStore();
  const { componentConfig } = useComponentConfigStore();
  const { scale, moveBy } = useCanvasStore();

  const page = pages.find(item => item.id === currentPageId);
  const components = page?.components || [];

  const isDragging = useRef(false);
  const lastPosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // 鼠标按下：开始拖拽
  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // 只在空白处才触发拖动（判断 target 是否是 background 区域）
    if ((e.target as HTMLElement).id !== "canvas-box-wrapper") {
      return;
    }

    isDragging.current = true;
    lastPosition.current = { x: e.clientX, y: e.clientY };
    // document.body.style.cursor = "grabbing";
  };

  // 鼠标移动：拖动 canvasBox
  const onMouseMove = (e: MouseEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastPosition.current.x;
    const dy = e.clientY - lastPosition.current.y;
    lastPosition.current = { x: e.clientX, y: e.clientY };
    moveBy(dx, dy);
  };

  const onMouseUp = () => {
    isDragging.current = false;
    // document.body.style.cursor = "grabbing";
  };

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  const renderComponents = (components: Component[]): React.ReactNode => {
    return components.map((component) => {
      const config = componentConfig?.[component.name];
      if (!config?.component) return null;
      return React.createElement(
        config.component,
        {
          key: component.id,
          id: component.id,
          ...config.defaultProps,
          ...component.props,
        },
        renderComponents(component.children || [])
      );
    });
  };

  return (
    <div
      className="h-full w-full overflow-hidden relative bg-[editor-bg] cursor-grabbing"
      onMouseDown={onMouseDown}
    >
      {/* 整体缩放区域 */}
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          width: "100%",
          height: "100%",
        }}
        id="canvas-box-wrapper" // 加一个 id 以识别是否点击了背景区域
      >
        <CanvasBox>
          {renderComponents(components)}
        </CanvasBox>
      </div>
    </div>
  );
}
