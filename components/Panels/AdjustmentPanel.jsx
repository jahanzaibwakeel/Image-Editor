'use client'

import { useRef } from 'react'
import { useEditorStore } from '@/store/editorStore'
import toast from 'react-hot-toast'

export default function AdjustmentPanel({ canvasRef }) {
  const { canvasSize, setCanvasSize, setZoom } = useEditorStore()
  const widthRef  = useRef(null)
  const heightRef = useRef(null)

  const rotate = (deg) => {
    const canvas = canvasRef?.current?.getCanvas?.()
    if (!canvas) return
    const ctx  = canvas.getContext('2d')
    const tmp  = document.createElement('canvas')
    tmp.width  = canvas.height
    tmp.height = canvas.width
    const tCtx = tmp.getContext('2d')
    tCtx.translate(tmp.width / 2, tmp.height / 2)
    tCtx.rotate((deg * Math.PI) / 180)
    tCtx.drawImage(canvas, -canvas.width / 2, -canvas.height / 2)
    canvas.width  = tmp.width
    canvas.height = tmp.height
    ctx.drawImage(tmp, 0, 0)
    toast.success(`Rotated ${deg > 0 ? 'right' : 'left'}`)
  }

  const flip = (axis) => {
    const canvas = canvasRef?.current?.getCanvas?.()
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const tmp = document.createElement('canvas')
    tmp.width  = canvas.width
    tmp.height = canvas.height
    const tCtx = tmp.getContext('2d')
    if (axis === 'h') {
      tCtx.translate(canvas.width, 0)
      tCtx.scale(-1, 1)
    } else {
      tCtx.translate(0, canvas.height)
      tCtx.scale(1, -1)
    }
    tCtx.drawImage(canvas, 0, 0)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(tmp, 0, 0)
    toast.success(`Flipped ${axis === 'h' ? 'horizontal' : 'vertical'}`)
  }

  const applyResize = () => {
    const canvas = canvasRef?.current?.getCanvas?.()
    if (!canvas) return
    const newW = parseInt(widthRef.current.value)  || canvas.width
    const newH = parseInt(heightRef.current.value) || canvas.height
    if (newW < 1 || newH < 1 || newW > 8000 || newH > 8000) {
      toast.error('Enter dimensions between 1–8000 px')
      return
    }
    const tmp  = document.createElement('canvas')
    tmp.width  = canvas.width
    tmp.height = canvas.height
    tmp.getContext('2d').drawImage(canvas, 0, 0)
    canvas.width  = newW
    canvas.height = newH
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, newW, newH)
    ctx.drawImage(tmp, 0, 0, newW, newH)
    setCanvasSize({ width: newW, height: newH })
    toast.success(`Resized to ${newW} x ${newH}`)
  }

  const clearCanvas = () => {
    const canvas = canvasRef?.current?.getCanvas?.()
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    toast.success('Canvas cleared')
  }

  return (
    <div className="p-4 space-y-5 fade-slide-in">

      {/* Transform */}
      <Section title="Transform">
        <div className="grid grid-cols-2 gap-2">
          <ActionButton label="Rotate Left"    onClick={() => rotate(-90)} />
          <ActionButton label="Rotate Right"   onClick={() => rotate(90)}  />
          <ActionButton label="Flip H"         onClick={() => flip('h')}   />
          <ActionButton label="Flip V"         onClick={() => flip('v')}   />
        </div>
      </Section>

      {/* Resize */}
      <Section title="Resize Canvas">
        <div className="flex gap-2 mb-2">
          <div className="flex-1">
            <label className="text-[10px] text-gray-500 block mb-1">Width (px)</label>
            <input
              ref={widthRef}
              type="number"
              defaultValue={canvasSize.width}
              className="w-full bg-dark-600 text-white text-sm px-2 py-1.5 rounded-md border border-dark-400 focus:border-accent outline-none"
            />
          </div>
          <div className="flex-1">
            <label className="text-[10px] text-gray-500 block mb-1">Height (px)</label>
            <input
              ref={heightRef}
              type="number"
              defaultValue={canvasSize.height}
              className="w-full bg-dark-600 text-white text-sm px-2 py-1.5 rounded-md border border-dark-400 focus:border-accent outline-none"
            />
          </div>
        </div>
        <ActionButton label="Apply Resize" onClick={applyResize} accent />
      </Section>

      {/* Zoom */}
      <Section title="Zoom">
        <div className="flex gap-2 flex-wrap">
          {[0.25, 0.5, 1, 1.5, 2, 3].map((z) => (
            <button
              key={z}
              onClick={() => setZoom(z)}
              className="px-2.5 py-1 text-[11px] rounded-md bg-dark-600 hover:bg-dark-500 text-gray-300 hover:text-white border border-dark-400 hover:border-accent/50 transition-all"
            >
              {z * 100}%
            </button>
          ))}
        </div>
      </Section>

      {/* Danger Zone */}
      <Section title="Danger Zone">
        <button
          onClick={clearCanvas}
          className="w-full py-2 text-sm rounded-lg border border-red-500/40 text-red-400 hover:bg-red-500/10 hover:border-red-500 transition-all"
        >
          Clear Canvas
        </button>
      </Section>

    </div>
  )
}

function Section({ title, children }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-500 mb-3">
        {title}
      </p>
      {children}
    </div>
  )
}

function ActionButton({ label, onClick, accent = false }) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full py-2 text-[12px] rounded-lg transition-all
        ${accent
          ? 'bg-accent hover:bg-accent-hover text-white'
          : 'bg-dark-600 hover:bg-dark-500 text-gray-300 hover:text-white border border-dark-400'}
      `}
    >
      {label}
    </button>
  )
}