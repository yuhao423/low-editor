import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useCanvasStore } from '@/editor/stores/useCanvasStore'
import { useEditorStore, getComponentById } from '@/editor/stores/useEditorStore';
export interface HoverMaskProps {
    /** 画布区的根元素的 id */
    containerId: string
    /** 组件ID */
    componentId: string;
    /** 给 CanvasBox 加一个wrapper，将hover的div加入wrapper中 */
    portalWrapperClassId: string
}

/**
 * 
 * TODO: 
 *  添加 resize 和 scroll 监听防抖更新（防止错位）
 *  加上 useLayoutEffect 比 useEffect 更合适（防止初始闪烁
 */
function SelectedMask({ containerId, componentId }: HoverMaskProps) {

    // const currentPage = useEditorStore((state) => state.currentPage)
    const { currentPageId, pages, currentComponent } = useEditorStore()
    console.log(currentComponent,'caozong');
    const { scale } = useCanvasStore();
    const [position, setPosition] = useState({
        left: 0,
        top: 0,
        width: 0,
        height: 0
    });

    useEffect(() => {
        updatePosition();
    }, [componentId]);

    useEffect(() => {
        // console.log(curSelectedComponent, currentComponent, 'currentPage');

        updatePosition()
    }, [currentComponent])

    function updatePosition() {
        if (!componentId) return;

        const container = document.getElementById(containerId);
        if (!container) return;

        const node = document.querySelector(`[data-component-id="${componentId}"]`);
        if (!node) return;

        const { top, left, width, height } = node.getBoundingClientRect();
        const { top: containerTop, left: containerLeft } = container.getBoundingClientRect();

        setPosition({
            top: (top - containerTop + container.scrollTop) / scale,
            left: (left - containerLeft + container.scrollTop) / scale,
            width: width / scale,
            height: height / scale
        });
    }

    const el = useMemo(() => {
        return document.getElementById('portal-wrapper')

    }, []);

    return createPortal((
        <div
            style={{
                position: "absolute",
                left: position.left,
                top: position.top,
                border: "1px solid var(--primary-main)",
                pointerEvents: "none",
                width: position.width,
                height: position.height,
                zIndex: "var(--hover-z-index)",
                boxSizing: 'border-box',
            }}
        />
    ), el!)
}

export default SelectedMask;
