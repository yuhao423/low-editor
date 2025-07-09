import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

export interface HoverMaskProps {
    /** 画布区的根元素的 id */
    containerId: string
    /** 组件ID */
    componentId: string;
    /** 给 CanvasBox 加一个wrapper，将hover的div加入wrapper中 */
    portalWrapperClassId: string
}

function HoverMask({ containerId, componentId }: HoverMaskProps) {

    const [position, setPosition] = useState({
        left: 0,
        top: 0,
        width: 0,
        height: 0
    });

    useEffect(() => {
        updatePosition();
    }, [componentId]);

    function updatePosition() {
        if (!componentId) return;

        const container = document.getElementById(containerId);
        if (!container) return;

        const node = document.querySelector(`[data-component-id="${componentId}"]`);
        if (!node) return;

        const { top, left, width, height } = node.getBoundingClientRect();
        const { top: containerTop, left: containerLeft } = container.getBoundingClientRect();

        setPosition({
            top: top - containerTop + container.scrollTop,
            left: left - containerLeft + container.scrollTop,
            width,
            height
        });
    }

    const el = useMemo(() => {
        // const el = document.createElement('div');
        // el.className = `wrapper`;

        // const container = document.getElementById(containerId);
        // console.log(container, 'container');

        // container!.appendChild(el);
        // return el;

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

export default HoverMask;
