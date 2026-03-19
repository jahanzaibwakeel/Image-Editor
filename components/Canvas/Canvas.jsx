'use client'

import {
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useState,
  useCallback,
} from 'react'
import { useEditorStore } from '@/store/editorStore'
import { useHistory } from '@/hooks/useHistory'
import { useCanvas } from '@/hooks/useCanvas'
import { buildFilterString } from '@/lib/filters'

const Canvas = forwardRef(function Canvas(_, ref) {
  const canvasRef  = useRef(null)
  const wrapperRef = useRef(null)
  const historyRef = useRef(null)

  const { filters, canvasSize, zoom, setZoom } = useEditorStore()
  const history = useHistory(canvasRef)
  historyRef.current = history

  const { onPointerDown, onPointerMove, onPointerUp } = useCanvas(canvasRef, historyRef)

  const [coords, setCoords] = useState({ x: 0, y: 0 })

  // Expose methods to parent
  useImperativeHandle(ref, () => ({
    getCanvas: () => canvasRef.current,
  }))

  // ── Initialize canvas ──
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width  = canvasSize.width
    canvas.height = canvasSize.height
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    history.save()
  }, []) // eslint-disable-line

  // ── Apply CSS filters (non-destructive preview) ──
  useEffect(() => {
    if (!canvasRef.current) return
    canvasRef.current.style.filter = buildFilterString(filters)
  }, [filters])

  // ── Global editor events ──
  useEffect(() => {
    const undo = () => history.undo()
    const redo = () => history.redo()

    const save = () => {
      window.dispatchEvent(new CustomEvent('editor:triggerSave'))
    }

    const loadImage = (e) => {
      const canvas = canvasRef.current
      if (!canvas) return
      const img = new Image()
      img.onload = () => {
        canvas.width  = img.naturalWidth  || canvasSize.width
        canvas.height = img.naturalHeight || canvasSize.height
        const ctx = canvas.getContext('2d')
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0)
        history.save()
      }
      img.src = e.detail
    }

    const newCanvas = () => {
      const canvas = canvasRef.current
      if (!canvas) return
      canvas.width  = canvasSize.width
      canvas.height = canvasSize.height
      const ctx = canvas.getContext('2d')
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      history.save()
    }

    window.addEventListener('editor:undo',      undo)
    window.addEventListener('editor:redo',      redo)
    window.addEventListener('editor:save',      save)
    window.addEventListener('editor:loadImage', loadImage)
    window.addEventListener('editor:newCanvas', newCanvas)
    return () => {
      window.removeEventListener('editor:undo',      undo)
      window.removeEventListener('editor:redo',      redo)
      window.removeEventListener('editor:save',      save)
      window.removeEventListener('editor:loadImage', loadImage)
      window.removeEventListener('editor:newCanvas', newCanvas)
    }
  }, [history, canvasSize])

  // ── Zoom with mouse wheel ──
  const handleWheel = useCallback((e) => {
    if (!e.ctrlKey) return
    e.preventDefault()
    setZoom(Math.min(5, Math.max(0.1, zoom + (e.deltaY < 0 ? 0.1 : -0.1))))
  }, [zoom, setZoom])

  useEffect(() => {
    const el = wrapperRef.current
    if (!el) return
    el.addEventListener('wheel', handleWheel, { passive: false })
    return () => el.removeEventListener('wheel', handleWheel)
  }, [handleWheel])

  // ── Cursor coordinates ──
  const handleMouseMove = useCallback((e) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width  / rect.width
    const scaleY = canvas.height / rect.height
    setCoords({
      x: Math.floor((e.clientX - rect.left) * scaleX),
      y: Math.floor((e.clientY - rect.top)  * scaleY),
    })
    onPointerMove(e)
  }, [onPointerMove])

  return (
    <div
      ref={wrapperRef}
      className="w-full h-full flex flex-col bg-dark-900 overflow-hidden"
    >
      {/* Canvas Scrollable Viewport */}
      <div className="flex-1 overflow-auto flex items-center justify-center p-8 canvas-checkerboard">
        <canvas
          ref={canvasRef}
          style={{
            transform:     `scale(${zoom})`,
            transformOrigin: 'center center',
            cursor:        'crosshair',
            display:       'block',
            boxShadow:     '0 8px 48px rgba(0,0,0,0.6)',
            borderRadius:  '2px',
          }}
          onMouseDown={onPointerDown}
          onMouseMove={handleMouseMove}
          onMouseUp={onPointerUp}
          onMouseLeave={onPointerUp}
          onTouchStart={onPointerDown}
          onTouchMove={onPointerMove}
          onTouchEnd={onPointerUp}
        />
      </div>

      {/* Status Bar */}
      <div className="h-7 px-4 bg-dark-800 border-t border-dark-600 flex items-center justify-between text-[10px] text-gray-500 shrink-0">
        <div className="flex items-center gap-4">
          <span>
            {canvasRef.current?.width || 0} x {canvasRef.current?.height || 0} px
          </span>
          <span>X: {coords.x}  Y: {coords.y}</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setZoom(Math.max(0.1, zoom - 0.1))}
            className="hover:text-white transition-colors px-1"
          >
            -
          </button>
          <span>{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => setZoom(Math.min(5, zoom + 0.1))}
            className="hover:text-white transition-colors px-1"
          >
            +
          </button>
          <button
            onClick={() => setZoom(1)}
            className="hover:text-white transition-colors px-1"
          >
            Reset
          </button>
          <span className="border-l border-dark-500 pl-3">
            Undo: {history.canUndo ? 'Y' : 'N'}  |  Redo: {history.canRedo ? 'Y' : 'N'}
          </span>
        </div>
      </div>
    </div>
  )
})

export default Canvas