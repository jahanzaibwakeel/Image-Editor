import { useRef, useEffect, useCallback } from 'react'
import { useEditorStore } from '@/store/editorStore'
import { floodFill, drawShapePreview, getPos } from '@/lib/canvasUtils'

export function useCanvas(canvasRef, historyRef) {
  const {
    activeTool,
    brush,
    textSettings,
    shapeSettings,
  } = useEditorStore()

  const isDrawing  = useRef(false)
  const lastPos    = useRef(null)
  const shapeStart = useRef(null)
  const snapshot   = useRef(null) // snapshot before shape preview

  // ── Brush / Eraser stroke ──
  const drawStroke = useCallback((ctx, from, to) => {
    ctx.globalCompositeOperation =
      activeTool === 'eraser' ? 'destination-out' : 'source-over'
    ctx.globalAlpha = brush.opacity / 100
    ctx.strokeStyle = brush.color
    ctx.lineWidth   = brush.size
    ctx.lineCap     = 'round'
    ctx.lineJoin    = 'round'

    ctx.beginPath()
    ctx.moveTo(from.x, from.y)
    ctx.lineTo(to.x, to.y)
    ctx.stroke()

    ctx.globalCompositeOperation = 'source-over'
    ctx.globalAlpha = 1
  }, [activeTool, brush])

  // ── Place text ──
  const placeText = useCallback((canvas, pos) => {
    const text = prompt('Enter text:')
    if (!text) return
    const ctx  = canvas.getContext('2d')
    const { font, size, color, bold, italic } = textSettings
    ctx.font        = `${italic ? 'italic ' : ''}${bold ? 'bold ' : ''}${size}px ${font}`
    ctx.fillStyle   = color
    ctx.globalAlpha = 1
    ctx.fillText(text, pos.x, pos.y)
  }, [textSettings])

  // ── Mouse down ──
  const onPointerDown = useCallback((e) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const pos = getPos(canvas, e)

    if (activeTool === 'fill') {
      floodFill(ctx, Math.floor(pos.x), Math.floor(pos.y), brush.color)
      historyRef?.current?.save()
      return
    }
    if (activeTool === 'text') {
      placeText(canvas, pos)
      historyRef?.current?.save()
      return
    }
    if (['rectangle', 'circle', 'line'].includes(activeTool)) {
      snapshot.current = ctx.getImageData(0, 0, canvas.width, canvas.height)
      shapeStart.current = pos
      isDrawing.current  = true
      return
    }

    isDrawing.current = true
    lastPos.current   = pos
    historyRef?.current?.save()
  }, [activeTool, brush.color, canvasRef, historyRef, placeText])

  // ── Mouse move ──
  const onPointerMove = useCallback((e) => {
    if (!isDrawing.current) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const pos = getPos(canvas, e)

    if (['rectangle', 'circle', 'line'].includes(activeTool)) {
      // Restore snapshot for live preview
      ctx.putImageData(snapshot.current, 0, 0)
      drawShapePreview(ctx, activeTool, shapeStart.current, pos, shapeSettings)
      return
    }

    if (activeTool === 'brush' || activeTool === 'eraser') {
      drawStroke(ctx, lastPos.current, pos)
      lastPos.current = pos
    }
  }, [activeTool, canvasRef, drawStroke, shapeSettings])

  // ── Mouse up ──
  const onPointerUp = useCallback(() => {
    if (!isDrawing.current) return
    isDrawing.current  = false
    shapeStart.current = null
    snapshot.current   = null
    historyRef?.current?.save()
  }, [historyRef])

  return { onPointerDown, onPointerMove, onPointerUp }
}
