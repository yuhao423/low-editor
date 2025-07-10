import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useCanvasStore } from '@/editor/stores/useCanvasStore';
import { useEditorStore } from '@/editor/stores/useEditorStore';

export interface HoverMaskProps {
    containerId: string;
    componentId: string;
    portalWrapperClassId: string;
}

function SelectedMask({ containerId, componentId }: HoverMaskProps) {
    const { scale } = useCanvasStore();
    const { currentComponent } = useEditorStore();

    const [position, setPosition] = useState({
        left: 0,
        top: 0,
        width: 0,
        height: 0
    });

    const observerRef = useRef<MutationObserver | null>(null);
    const debounceTimer = useRef<NodeJS.Timeout | null>(null);

    const updatePosition = () => {
        const container = document.getElementById(containerId);
        const node = document.querySelector(`[data-component-id="${componentId}"]`);

        if (!container || !node) return;

        const { top, left, width, height } = node.getBoundingClientRect();
        const { top: containerTop, left: containerLeft } = container.getBoundingClientRect();

        setPosition({
            top: (top - containerTop + container.scrollTop) / scale,
            left: (left - containerLeft + container.scrollTop) / scale,
            width: width / scale,
            height: height / scale
        });
    };

    const debounceUpdate = () => {
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(() => {
            requestAnimationFrame(updatePosition);
        }, 0);
    };

    // 初始 + 组件变化后
    useLayoutEffect(() => {
        debounceUpdate();
    }, [currentComponent]);

    // 监听 DOM 结构变化
    useLayoutEffect(() => {
        const target = document.querySelector(`[data-component-id="${componentId}"]`);
        if (!target) return;

        observerRef.current?.disconnect();
        observerRef.current = new MutationObserver(debounceUpdate);
        observerRef.current.observe(target, { childList: true, subtree: true });

        return () => {
            observerRef.current?.disconnect();
        };
    }, [componentId]);

    // 监听 window resize 和容器滚动
    useLayoutEffect(() => {
        const container = document.getElementById(containerId);
        if (!container) return;

        window.addEventListener('resize', debounceUpdate);
        container.addEventListener('scroll', debounceUpdate);

        return () => {
            window.removeEventListener('resize', debounceUpdate);
            container.removeEventListener('scroll', debounceUpdate);
        };
    }, [containerId]);

    const el = useMemo(() => {
        return document.getElementById('portal-wrapper');
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
