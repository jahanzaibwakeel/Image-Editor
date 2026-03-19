'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { useEditorStore } from '@/store/editorStore'
import { buildFilterString } from '@/lib/filters'

export default function ExportPanel({ canvasRef }) {
  const { filters } = useEditorStore()
  const [format,  setFormat]  = useState('png')
  const [quality, setQuality] = useState(92)
  const [bakeFilters, setBakeFilters] = useState(false)

  const handleExport = () => {
    const canvas = canvasRef?.current?.getCanvas?.()
    if (!canvas) {
      toast.error('No canvas to export')
      return
    }

    let exportCanvas = canvas

    // Bake CSS filters into a new canvas if requested
    if (bakeFilters) {
      exportCanvas = document.createElement('canvas')
      exportCanvas.width  = canvas.width
      exportCanvas.height = canvas.height
      const ctx = exportCanvas.getContext('2d')

      // Apply filter string as CSS — then draw
      const offscreen = document.createElement('canvas')
      offscreen.width  = canvas.width
      offscreen.height = canvas.height
      const oCtx = offscreen.getContext('2d')

      // Use svg filter trick to bake CSS filters
      const filterStr = buildFilterString(filters)
      const img = new Image()
      img.onload = () => {
        ctx.filter = filterStr
        ctx.drawImage(img, 0, 0)
        triggerDownload(exportCanvas, format, quality)
      }
      img.src = canvas.toDataURL()
      return
    }

    triggerDownload(exportCanvas, format, quality)
  }

  const triggerDownload = (canvas, fmt, q) => {
    const mimeType = fmt === 'jpg' ? 'image/jpeg' : `image/${fmt}`
    const dataURL  = canvas.toDataURL(mimeType, q / 100)
    const link     = document.createElement('a')
    link.download  = `pixelforge-export.${fmt}`
    link.href      = dataURL
    link.click()
    toast.success(`Exported as ${fmt.toUpperCase()}!`)
  }

  const copyToClipboard = async () => {
    const canvas = canvasRef?.current?.getCanvas?.()
    if (!canvas) return
    try {
      canvas.toBlob(async (blob) => {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob }),
        ])
        toast.success('Copied to clipboard!')
      })
    } catch {
      toast.error('Clipboard copy failed')
    }
  }

  return (
    <div className="p-4 space-y-5 fade-slide-in">

      {/* Format */}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-500 mb-3">
          Format
        </p>
        <div className="flex gap-2">
          {['png', 'jpg', 'webp'].map((f) => (
            <button
              key={f}
              onClick={() => setFormat(f)}
              className={`
                flex-1 py-2 text-[12px] rounded-lg border transition-all uppercase font-semibold
                ${format === f
                  ? 'bg-accent border-accent text-white'
                  : 'border-dark-400 text-gray-400 hover:border-accent/50 hover:text-white bg-dark-700'}
              `}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Quality (only for jpg/webp) */}
      {format !== 'png' && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">
              Quality
            </p>
            <span className="text-[11px] font-mono text-accent">{quality}%</span>
          </div>
          <input
            type="range"
            min={10}
            max={100}
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
            className="w-full"
          />
        </div>
      )}

      {/* Options */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer group">
          <input
            type="checkbox"
            checked={bakeFilters}
            onChange={(e) => setBakeFilters(e.target.checked)}
            className="w-4 h-4 accent-purple-500 rounded"
          />
          <span className="text-[12px] text-gray-400 group-hover:text-white transition-colors">
            Bake filters into export
          </span>
        </label>
        <p className="text-[10px] text-gray-600 mt-1 ml-6">
          Permanently applies filter effects to exported file
        </p>
      </div>

      <div className="h-px bg-dark-600" />

      {/* Export Buttons */}
      <div className="space-y-2">
        <button
          onClick={handleExport}
          className="w-full py-2.5 rounded-lg bg-accent hover:bg-accent-hover text-white text-sm font-semibold transition-all"
        >
          Download {format.toUpperCase()}
        </button>
        <button
          onClick={copyToClipboard}
          className="w-full py-2.5 rounded-lg border border-dark-400 hover:border-accent/50 bg-dark-700 hover:bg-dark-600 text-gray-300 hover:text-white text-sm transition-all"
        >
          Copy to Clipboard
        </button>
      </div>

      {/* Info */}
      <div className="p-3 rounded-lg bg-dark-700 border border-dark-500">
        <p className="text-[10px] text-gray-500 leading-relaxed">
          Canvas dimensions are preserved on export.
          PNG supports transparency. Use JPG for smaller file sizes.
          WebP offers best compression.
        </p>
      </div>

    </div>
  )
}