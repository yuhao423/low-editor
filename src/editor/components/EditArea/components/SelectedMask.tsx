import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useCanvasStore } from '@/editor/stores/useCanvasStore'
import { useEditorStore } from '@/editor/stores/useEditorStore'

export interface HoverMaskProps {
  containerId: string
  componentId: string
  portalWrapperClassId: string
}

function SelectedMask({ containerId, componentId }: HoverMaskProps) {
  const { scale } = useCanvasStore()
  const { currentComponent } = useEditorStore()

  const [position, setPosition] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  })

  /** 节流处理,避免过于频繁的触发重计算 */
  const debounceTimer = useRef<NodeJS.Timeout | null>(null)

  const updatePosition = () => {
    const container = document.getElementById(containerId)
    const node = document.querySelector(`[data-component-id="${componentId}"]`)

    if (!container || !node) return

    const { top, left, width, height } = node.getBoundingClientRect()
    const { top: containerTop, left: containerLeft } = container.getBoundingClientRect()
    const isPage = currentComponent?.name === 'Page'

    const EXPAND = 2 // 扩大 2px 四周
    setPosition({
      top: isPage ? 0 : (top - containerTop + container.scrollTop) / scale - EXPAND,
      left: isPage ? 0 : (left - containerLeft + container.scrollLeft) / scale - EXPAND,
      width: width / scale + EXPAND * 1,
      height: height / scale + EXPAND * 1,
    })
  }

  const debounceUpdate = () => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(() => {
      requestAnimationFrame(updatePosition)
    }, 0)
  }

  // 初始 + 组件变化后
  useLayoutEffect(() => {
    debounceUpdate()
  }, [currentComponent])

  // 监听 DOM 结构变化
  useLayoutEffect(() => {
    const target = document.querySelector(`[data-component-id="${componentId}"]`)
    if (!target) return

    const reSizeObserver = new ResizeObserver(() => {
      debounceUpdate()
    })
    reSizeObserver.observe(target)
    return () => {
      reSizeObserver.disconnect()
    }
  }, [componentId])

  // 监听 window resize 和容器滚动
  useLayoutEffect(() => {
    const container = document.getElementById(containerId)
    if (!container) return

    window.addEventListener('resize', debounceUpdate)
    container.addEventListener('scroll', debounceUpdate)

    return () => {
      window.removeEventListener('resize', debounceUpdate)
      container.removeEventListener('scroll', debounceUpdate)
    }
  }, [containerId])

  const el = useMemo(() => {
    return document.getElementById('portal-wrapper')
  }, [])

  return createPortal(
    <div
      style={{
        position: 'absolute',
        left: position.left,
        top: position.top,
        border: '2px solid var(--primary-main)',
        pointerEvents: 'none',
        width: position.width,
        height: position.height,
        zIndex: 'var(--hover-index)',
        boxSizing: 'border-box',
      }}
    />,
    el!,
  )
}

export default SelectedMask
