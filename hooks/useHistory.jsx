import { useRef, useState, useCallback } from 'react'

export function useHistory(canvasRef) {
  const stack     = useRef([])
  const pointer   = useRef(-1)
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)

  const sync = () => {
    setCanUndo(pointer.current > 0)
    setCanRedo(pointer.current < stack.current.length - 1)
  }

  const save = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx       = canvas.getContext('2d')
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    // Cut off redo history when new action is performed
    stack.current   = stack.current.slice(0, pointer.current + 1)
    stack.current.push(imageData)
    // Keep only last 30 snapshots
    if (stack.current.length > 30) stack.current.shift()
    pointer.current = stack.current.length - 1
    sync()
  }, [canvasRef])

  const undo = useCallback(() => {
    if (pointer.current <= 0) return
    pointer.current--
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.getContext('2d').putImageData(stack.current[pointer.current], 0, 0)
    sync()
  }, [canvasRef])

  const redo = useCallback(() => {
    if (pointer.current >= stack.current.length - 1) return
    pointer.current++
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.getContext('2d').putImageData(stack.current[pointer.current], 0, 0)
    sync()
  }, [canvasRef])

  return { save, undo, redo, canUndo, canRedo }
}
