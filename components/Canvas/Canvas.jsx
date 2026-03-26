
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

// ── Inline Text Overlay Component ────────────────────────────────────────────
function TextInputOverlay({ overlay, onSubmit, onCancel, textSettings }) {
  const [value, setValue] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 50)
    return () => clearTimeout(timer)
  }, [])

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSubmit(value)
    }
    if (e.key === 'Escape') onCancel()
  }

  return (
    <div
      className="fixed inset-0 z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel()
      }}
    >
      <div
        style={{
          position: 'fixed',
          left: overlay.screenX,
          top: overlay.screenY,
          zIndex: 100,
          transform: 'translateY(-100%)',
        }}
        className="bg-dark-800 border border-blue-500 rounded-lg shadow-2xl p-3 flex flex-col gap-2 min-w-[260px]"
      >
        <div className="text-[10px] text-gray-400 font-medium tracking-wider uppercase">
          Type text - Enter to place, Esc to cancel
        </div>

        <textarea
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKey}
          rows={3}
          placeholder="Type your text here..."
          className="text-sm rounded px-2 py-1.5 outline-none border border-gray-300 focus:border-blue-400 resize-none"
          style={{
            backgroundColor: '#ffffff',
            fontFamily: textSettings.font,
            fontSize: textSettings.size,
            color: textSettings.color || '#000000',
            caretColor: textSettings.color || '#000000',
            fontWeight: textSettings.bold ? 'bold' : 'normal',
            fontStyle: textSettings.italic ? 'italic' : 'normal',
          }}
        />

        <div className="flex gap-2 justify-end">
          <button
            onClick={() => onCancel()}
            className="text-[11px] px-3 py-1 rounded bg-dark-600 hover:bg-dark-500 text-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit(value)}
            className="text-[11px] px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white"
          >
            Place Text
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main Canvas Component ─────────────────────────────────────────────────────
const Canvas = forwardRef(function Canvas(_, ref) {
  const canvasRef = useRef(null)
  const wrapperRef = useRef(null)
  const historyRef = useRef(null)

  const filters = useEditorStore((s) => s.filters)
  const canvasSize = useEditorStore((s) => s.canvasSize)
  const zoom = useEditorStore((s) => s.zoom)
  const setZoom = useEditorStore((s) => s.setZoom)
  const textSettings = useEditorStore((s) => s.textSettings)

  const history = useHistory(canvasRef)
  historyRef.current = history

  const {
    onPointerDown,
    onPointerMove,
    onPointerUp,
    textOverlay,
    onTextSubmit,
    setTextOverlay,
  } = useCanvas(canvasRef, historyRef)

  const [coords, setCoords] = useState({ x: 0, y: 0 })

  useImperativeHandle(ref, () => ({
    getCanvas: () => canvasRef.current,
  }))

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = canvasSize.width
    canvas.height = canvasSize.height
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    history.save()
  }, []) // eslint-disable-line

  useEffect(() => {
    if (!canvasRef.current) return
    canvasRef.current.style.filter = buildFilterString(filters)
  }, [filters])

  useEffect(() => {
    const undo = () => history.undo()
    const redo = () => history.redo()
    const save = () => window.dispatchEvent(new CustomEvent('editor:triggerSave'))

    // ✅ IMAGE UPLOAD — DO NOT TOUCH THIS BLOCK
    const loadImage = (e) => {
      const canvas = canvasRef.current
      if (!canvas) return
      const img = new Image()
      img.onload = () => {
        canvas.width = img.naturalWidth || canvasSize.width
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
      canvas.width = canvasSize.width
      canvas.height = canvasSize.height
      const ctx = canvas.getContext('2d')
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      history.save()
    }

    window.addEventListener('editor:undo', undo)
    window.addEventListener('editor:redo', redo)
    window.addEventListener('editor:save', save)
    window.addEventListener('editor:loadImage', loadImage)
    window.addEventListener('editor:newCanvas', newCanvas)
    return () => {
      window.removeEventListener('editor:undo', undo)
      window.removeEventListener('editor:redo', redo)
      window.removeEventListener('editor:save', save)
      window.removeEventListener('editor:loadImage', loadImage)
      window.removeEventListener('editor:newCanvas', newCanvas)
    }
  }, [history, canvasSize])

  const handleWheel = useCallback((e) => {
    if (!e.ctrlKey) return
    e.preventDefault()
    const current = useEditorStore.getState().zoom
    useEditorStore.getState().setZoom(
      Math.min(5, Math.max(0.1, current + (e.deltaY < 0 ? 0.1 : -0.1)))
    )
  }, [])

  useEffect(() => {
    const el = wrapperRef.current
    if (!el) return
    el.addEventListener('wheel', handleWheel, { passive: false })
    return () => el.removeEventListener('wheel', handleWheel)
  }, [handleWheel])

  const handleMouseMove = useCallback(
    (e) => {
      const canvas = canvasRef.current
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      const scaleX = canvas.width / rect.width
      const scaleY = canvas.height / rect.height
      setCoords({
        x: Math.floor((e.clientX - rect.left) * scaleX),
        y: Math.floor((e.clientY - rect.top) * scaleY),
      })
      onPointerMove(e)
    },
    [onPointerMove]
  )

  return (
    <div
      ref={wrapperRef}
      className="w-full h-full flex flex-col bg-dark-900 overflow-hidden"
    >
      {textOverlay && (
        <TextInputOverlay
          overlay={textOverlay}
          onSubmit={onTextSubmit}
          onCancel={() => setTextOverlay(null)}
          textSettings={textSettings}
        />
      )}

      <div className="flex-1 overflow-auto flex items-center justify-center p-8 canvas-checkerboard">
        <canvas
          ref={canvasRef}
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'center center',
            cursor: 'crosshair',
            display: 'block',
            boxShadow: '0 8px 48px rgba(0,0,0,0.6)',
            borderRadius: '2px',
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

      <div className="h-7 px-4 bg-dark-800 border-t border-dark-600 flex items-center justify-between text-[10px] text-gray-500 shrink-0">
        <div className="flex items-center gap-4">
          <span>{canvasRef.current?.width || 0} x {canvasRef.current?.height || 0} px</span>
          <span>X: {coords.x} Y: {coords.y}</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setZoom(Math.max(0.1, zoom - 0.1))} className="hover:text-white px-1">-</button>
          <span>{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom(Math.min(5, zoom + 0.1))} className="hover:text-white px-1">+</button>
          <button onClick={() => setZoom(1)} className="hover:text-white px-1">Reset</button>
          <span className="border-l border-dark-500 pl-3">
            Undo: {history.canUndo ? 'Y' : 'N'} | Redo: {history.canRedo ? 'Y' : 'N'}
          </span>
        </div>
      </div>
    </div>
  )
})

export default Canvas
