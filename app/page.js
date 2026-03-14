'use client'

import { useState, useRef, useEffect } from 'react'
import Canvas from '@/components/Canvas/Canvas'
import Toolbar from '@/components/Toolbar/Toolbar'
import FilterPanel from '@/components/Panels/FilterPanel'
import AdjustmentPanel from '@/components/Panels/AdjustmentPanel'
import LayerPanel from '@/components/Panels/LayerPanel'
import ExportPanel from '@/components/Panels/ExportPanel'
import { useEditorStore } from '@/store/editorStore'
import toast from 'react-hot-toast'

export default function EditorPage() {
  const canvasRef = useRef(null)
  const fileInputRef = useRef(null)
  const { activeTool, setActiveTool } = useEditorStore()
  const [activePanel, setActivePanel] = useState('filters')
  const [showWelcome, setShowWelcome] = useState(true)

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z') { e.preventDefault(); window.dispatchEvent(new CustomEvent('editor:undo')) }
        if (e.key === 'y') { e.preventDefault(); window.dispatchEvent(new CustomEvent('editor:redo')) }
        if (e.key === 's') { e.preventDefault(); window.dispatchEvent(new CustomEvent('editor:save')) }
      }
      if (!e.ctrlKey && !e.metaKey) {
        if (e.key === 'b') setActiveTool('brush')
        if (e.key === 'e') setActiveTool('eraser')
        if (e.key === 't') setActiveTool('text')
        if (e.key === 'r') setActiveTool('rectangle')
        if (e.key === 'c') setActiveTool('circle')
        if (e.key === 'l') setActiveTool('line')
        if (e.key === 'f') setActiveTool('fill')
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [setActiveTool])

  const handleUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file')
      return
    }
    const reader = new FileReader()
    reader.onload = (ev) => {
      window.dispatchEvent(new CustomEvent('editor:loadImage', { detail: ev.target.result }))
      setShowWelcome(false)
      toast.success('Image loaded successfully!')
    }
    reader.readAsDataURL(file)
  }

  const handleNewCanvas = () => {
    window.dispatchEvent(new CustomEvent('editor:newCanvas'))
    setShowWelcome(false)
    toast.success('New canvas created!')
  }

  const panels = [
    { id: 'filters',     label: 'Filters'     },
    { id: 'adjustments', label: 'Adjustments' },
    { id: 'layers',      label: 'Layers'      },
    { id: 'export',      label: 'Export'      },
  ]

  return (
    <div className="flex flex-col h-screen bg-dark-900 overflow-hidden">

      {/* ── Top Header ── */}
      <header className="flex items-center justify-between px-5 h-12 bg-dark-800 border-b border-dark-600 shrink-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
          </div>
          <span className="text-sm font-semibold text-white tracking-wide">PixelForge Editor</span>
        </div>

        <div className="flex items-center gap-2">
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-xs px-3 py-1.5 rounded-md bg-dark-600 hover:bg-dark-500 text-gray-300 hover:text-white transition-all border border-dark-400"
          >
            Open Image
          </button>
          <button
            onClick={handleNewCanvas}
            className="text-xs px-3 py-1.5 rounded-md bg-accent hover:bg-accent-hover text-white transition-all"
          >
            New Canvas
          </button>
        </div>
      </header>

      {/* ── Main Layout ── */}
      <div className="flex flex-1 min-h-0">

        {/* Left Toolbar */}
        <Toolbar />

        {/* Canvas Area */}
        <div className="flex-1 min-w-0 relative">
          {showWelcome && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-dark-900/95 fade-slide-in">
              <div className="flex flex-col items-center gap-5 p-10 rounded-2xl border border-dark-500 bg-dark-800 shadow-2xl max-w-md w-full mx-4">
                <div className="w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6c63ff" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                </div>
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-white mb-1">PixelForge</h1>
                  <p className="text-sm text-gray-400">Canvas-based image editor with filters, layers, and local storage</p>
                </div>
                <div className="flex flex-col gap-3 w-full">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-white text-sm font-medium transition-all"
                  >
                    Open Image from Computer
                  </button>
                  <button
                    onClick={handleNewCanvas}
                    className="w-full py-2.5 rounded-xl border border-dark-400 hover:border-accent/50 bg-dark-700 hover:bg-dark-600 text-gray-300 hover:text-white text-sm transition-all"
                  >
                    Start with Blank Canvas
                  </button>
                </div>
                <p className="text-xs text-gray-500">Tip: Use keyboard shortcuts — B (brush), E (eraser), T (text), Ctrl+Z (undo)</p>
              </div>
            </div>
          )}
          <Canvas ref={canvasRef} />
        </div>

        {/* Right Panel */}
        <div className="w-64 bg-dark-800 border-l border-dark-600 flex flex-col shrink-0 overflow-hidden">
          {/* Panel Tabs */}
          <div className="grid grid-cols-4 border-b border-dark-600 shrink-0">
            {panels.map((p) => (
              <button
                key={p.id}
                onClick={() => setActivePanel(p.id)}
                className={`py-2.5 text-[10px] font-semibold uppercase tracking-wider transition-all ${
                  activePanel === p.id
                    ? 'text-accent border-b-2 border-accent bg-dark-700'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Panel Content */}
          <div className="flex-1 overflow-y-auto">
            {activePanel === 'filters'     && <FilterPanel     canvasRef={canvasRef} />}
            {activePanel === 'adjustments' && <AdjustmentPanel canvasRef={canvasRef} />}
            {activePanel === 'layers'      && <LayerPanel      canvasRef={canvasRef} />}
            {activePanel === 'export'      && <ExportPanel     canvasRef={canvasRef} />}
          </div>
        </div>
      </div>
    </div>
  )
}