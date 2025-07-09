import React, { useRef } from "react";
import { useCanvasStore } from "@/editor/stores/useCanvasStore";

export function CanvasBox({ children }: { children?: React.ReactNode }) {
  const { position, size, scale } = useCanvasStore();

  return (
    <div
      id="canvas-box" // 👈 供外层判断使用
      className="absolute border border-gray-300 bg-white shadow-md cursor-default"
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
      }}
    >
      {children}
    </div>
  );
}
