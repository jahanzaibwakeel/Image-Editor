import { useRef, useCallback, useState } from 'react'
import { useEditorStore } from '@/store/editorStore'
import { floodFill, getPos } from '@/lib/canvasUtils'

export function useCanvas(canvasRef, historyRef) {
  const isDrawing = useRef(false)
  const lastPos = useRef(null)
  const shapeStart = useRef(null)
  const snapshot = useRef(null)

  const [textOverlay, setTextOverlay] = useState(null)

  // ─── Always read LIVE state ───────────────────────────────────────────
  const S = () => useEditorStore.getState()

  // ─── Draw a brush/eraser stroke ──────────────────────────────────────
  const drawStroke = useCallback((ctx, from, to) => {
    const { activeTool, brush, selectedColor } = S()
    const strokeColor = brush?.color || selectedColor || '#000000'

    ctx.save()
    ctx.globalCompositeOperation =
      activeTool === 'eraser' ? 'destination-out' : 'source-over'
    ctx.globalAlpha = activeTool === 'eraser' ? 1 : (brush.opacity ?? 100) / 100
    ctx.strokeStyle = activeTool === 'eraser' ? '#000000' : strokeColor
    ctx.lineWidth = brush.size
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.beginPath()
    ctx.moveTo(from.x, from.y)
    ctx.lineTo(to.x + 0.001, to.y + 0.001)
    ctx.stroke()
    ctx.restore()
  }, [])

  // ─── Draw shape preview ───────────────────────────────────────────────
  const drawShapePreview = useCallback((ctx, tool, start, end) => {
    const { shapeSettings, selectedColor } = S()
    const stroke = shapeSettings.strokeColor || selectedColor || '#000000'
    const fillColor =
      shapeSettings.fillColor || shapeSettings.strokeColor || selectedColor || '#000000'

    ctx.save()
    ctx.strokeStyle = stroke
    ctx.fillStyle = fillColor
    ctx.lineWidth = shapeSettings.strokeWidth
    ctx.globalAlpha = 1
    ctx.globalCompositeOperation = 'source-over'

    if (tool === 'line') {
      ctx.beginPath()
      ctx.moveTo(start.x, start.y)
      ctx.lineTo(end.x, end.y)
      ctx.stroke()
    } else if (tool === 'rectangle') {
      const w = end.x - start.x
      const h = end.y - start.y
      if (shapeSettings.fill) {
        ctx.fillRect(start.x, start.y, w, h)
      } else {
        ctx.strokeRect(start.x, start.y, w, h)
      }
    } else if (tool === 'circle') {
      const rx = Math.abs(end.x - start.x) / 2
      const ry = Math.abs(end.y - start.y) / 2
      const cx = start.x + (end.x - start.x) / 2
      const cy = start.y + (end.y - start.y) / 2
      ctx.beginPath()
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2)
      if (shapeSettings.fill) ctx.fill()
      else ctx.stroke()
    }

    ctx.restore()
  }, [])

  // ─── Place text on canvas ─────────────────────────────────────────────
  const placeTextOnCanvas = useCallback((canvas, pos, text) => {
    const { textSettings, selectedColor } = S()
    const ctx = canvas.getContext('2d')
    const lines = text.split('\n')
    const fontSize = textSettings.size ?? 16
    const lineHeight = fontSize * 1.2
    const textColor = textSettings.color || selectedColor || '#000000'

    ctx.save()
    ctx.font = `${textSettings.italic ? 'italic ' : ''}${textSettings.bold ? 'bold ' : ''}${fontSize}px ${textSettings.font || 'sans-serif'}`
    ctx.fillStyle = textColor
    ctx.globalAlpha = 1
    ctx.globalCompositeOperation = 'source-over'
    ctx.textBaseline = 'top'

    lines.forEach((line, index) => {
      ctx.fillText(line, pos.x, pos.y + index * lineHeight)
    })

    ctx.restore()
  }, [])

  // ─── POINTER DOWN ─────────────────────────────────────────────────────
  const onPointerDown = useCallback((e) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const pos = getPos(canvas, e)
    const { activeTool, brush, selectedColor } = S()

    // Fill tool
    if (activeTool === 'fill') {
      floodFill(
        ctx,
        Math.floor(pos.x),
        Math.floor(pos.y),
        brush.color || selectedColor || '#000000'
      )
      historyRef?.current?.save()
      return
    }

    // Text tool — show overlay
    if (activeTool === 'text') {
      const rect = canvas.getBoundingClientRect()
      const scaleX = rect.width / canvas.width
      const scaleY = rect.height / canvas.height
      setTextOverlay({
        canvasX: pos.x,
        canvasY: pos.y,
        screenX: rect.left + pos.x * scaleX,
        screenY: rect.top + pos.y * scaleY,
      })
      return
    }

    // Shape tools
    if (['rectangle', 'circle', 'line'].includes(activeTool)) {
      snapshot.current = ctx.getImageData(0, 0, canvas.width, canvas.height)
      shapeStart.current = pos
      isDrawing.current = true
      return
    }

    // Brush / eraser
    isDrawing.current = true
    lastPos.current = pos
    drawStroke(ctx, pos, pos)
  }, [canvasRef, historyRef, drawStroke])

  // ─── POINTER MOVE ─────────────────────────────────────────────────────
  const onPointerMove = useCallback((e) => {
    if (!isDrawing.current) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const pos = getPos(canvas, e)
    const { activeTool } = S()

    if (['rectangle', 'circle', 'line'].includes(activeTool)) {
      if (!snapshot.current || !shapeStart.current) return
      ctx.putImageData(snapshot.current, 0, 0)
      drawShapePreview(ctx, activeTool, shapeStart.current, pos)
      return
    }

    if (activeTool === 'brush' || activeTool === 'eraser') {
      if (!lastPos.current) return
      drawStroke(ctx, lastPos.current, pos)
      lastPos.current = pos
    }
  }, [canvasRef, drawStroke, drawShapePreview])

  // ─── POINTER UP ───────────────────────────────────────────────────────
  const onPointerUp = useCallback(() => {
    if (!isDrawing.current) return
    isDrawing.current = false
    shapeStart.current = null
    snapshot.current = null
    lastPos.current = null
    historyRef?.current?.save()
  }, [historyRef])

  // ─── Text overlay submit ──────────────────────────────────────────────
  const onTextSubmit = useCallback((text) => {
    if (!textOverlay) return
    const canvas = canvasRef.current
    if (!canvas) return
    if (text.trim()) {
      placeTextOnCanvas(canvas, { x: textOverlay.canvasX, y: textOverlay.canvasY }, text)
      historyRef?.current?.save()
    }
    setTextOverlay(null)
  }, [textOverlay, canvasRef, historyRef, placeTextOnCanvas])

  return { onPointerDown, onPointerMove, onPointerUp, textOverlay, onTextSubmit, setTextOverlay }
}
