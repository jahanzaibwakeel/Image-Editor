'use client'

import { useEditorStore } from '@/store/editorStore'
import { HexColorPicker } from 'react-colorful'
import { useState } from 'react'

const TOOLS = [
  { id: 'brush',     label: 'Brush',     key: 'B', icon: BrushIcon     },
  { id: 'eraser',    label: 'Eraser',    key: 'E', icon: EraserIcon    },
  { id: 'fill',      label: 'Fill',      key: 'F', icon: FillIcon      },
  { id: 'text',      label: 'Text',      key: 'T', icon: TextIcon      },
  { id: 'rectangle', label: 'Rectangle', key: 'R', icon: RectIcon      },
  { id: 'circle',    label: 'Circle',    key: 'C', icon: CircleIcon    },
  { id: 'line',      label: 'Line',      key: 'L', icon: LineIcon      },
]

export default function Toolbar() {
  const { activeTool, setActiveTool, brush, updateBrush } = useEditorStore()
  const [showPicker, setShowPicker] = useState(false)

  return (
    <div className="w-14 bg-dark-800 border-r border-dark-600 flex flex-col items-center py-3 gap-1 shrink-0 relative z-20">

      {/* Tools */}
      {TOOLS.map((t) => (
        <ToolButton
          key={t.id}
          tool={t}
          active={activeTool === t.id}
          onClick={() => setActiveTool(t.id)}
        />
      ))}

      {/* Divider */}
      <div className="w-8 h-px bg-dark-500 my-2" />

      {/* Color Swatch */}
      <div className="relative">
        <button
          onClick={() => setShowPicker((p) => !p)}
          title="Pick color"
          className="w-8 h-8 rounded-full border-2 border-dark-400 hover:border-accent transition-colors shadow-inner"
          style={{ background: brush.color }}
        />
        {showPicker && (
          <div className="absolute left-14 top-0 z-50 p-2 bg-dark-700 rounded-xl border border-dark-500 shadow-2xl">
            <HexColorPicker
              color={brush.color}
              onChange={(c) => updateBrush({ color: c })}
            />
            <div className="mt-2 flex items-center gap-2">
              <span className="text-[10px] text-gray-400 font-mono">
                {brush.color.toUpperCase()}
              </span>
              <button
                onClick={() => setShowPicker(false)}
                className="ml-auto text-[10px] text-gray-400 hover:text-white"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Brush Size */}
      <div className="w-8 flex flex-col items-center gap-1 mt-1">
        <span className="text-[9px] text-gray-500">Size</span>
        <div
          className="rounded-full bg-white"
          style={{
            width:  Math.min(28, Math.max(4, brush.size / 3)) + 'px',
            height: Math.min(28, Math.max(4, brush.size / 3)) + 'px',
          }}
        />
        <input
          type="range"
          min="1"
          max="80"
          value={brush.size}
          onChange={(e) => updateBrush({ size: Number(e.target.value) })}
          style={{ writingMode: 'vertical-lr', direction: 'rtl', height: '60px', width: '4px' }}
        />
        <span className="text-[9px] text-gray-500">{brush.size}</span>
      </div>

      {/* Opacity */}
      <div className="w-8 flex flex-col items-center gap-1 mt-2">
        <span className="text-[9px] text-gray-500">Opacity</span>
        <input
          type="range"
          min="1"
          max="100"
          value={brush.opacity}
          onChange={(e) => updateBrush({ opacity: Number(e.target.value) })}
          style={{ writingMode: 'vertical-lr', direction: 'rtl', height: '60px', width: '4px' }}
        />
        <span className="text-[9px] text-gray-500">{brush.opacity}%</span>
      </div>

      {/* Undo / Redo */}
      <div className="flex flex-col gap-1 mt-auto">
        <button
          onClick={() => window.dispatchEvent(new CustomEvent('editor:undo'))}
          title="Undo (Ctrl+Z)"
          className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-dark-600 transition-all"
        >
          <UndoIcon />
        </button>
        <button
          onClick={() => window.dispatchEvent(new CustomEvent('editor:redo'))}
          title="Redo (Ctrl+Y)"
          className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-dark-600 transition-all"
        >
          <RedoIcon />
        </button>
      </div>
    </div>
  )
}

// ── Tool Button ──
function ToolButton({ tool, active, onClick }) {
  return (
    <button
      onClick={onClick}
      title={`${tool.label} (${tool.key})`}
      className={`
        w-9 h-9 rounded-lg flex items-center justify-center transition-all relative group
        ${active
          ? 'bg-accent text-white shadow-lg shadow-accent/30'
          : 'text-gray-400 hover:text-white hover:bg-dark-600'}
      `}
    >
      <tool.icon />
      {/* Tooltip */}
      <span className="absolute left-12 top-1/2 -translate-y-1/2 bg-dark-600 text-white text-[11px] px-2 py-1 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-dark-400">
        {tool.label} <span className="text-gray-400">({tool.key})</span>
      </span>
    </button>
  )
}

// ── SVG Icons ──
function BrushIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9.06 11.9l8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08"/>
      <path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.5 .62 1.22 2.04 2.02 3.37 1.52 2.95-1.11 3.63-4.97 1.63-7.04z"/>
    </svg>
  )
}
function EraserIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"/>
      <path d="M22 21H7"/><path d="m5 11 9 9"/>
    </svg>
  )
}
function FillIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m19 11-8-8-8.5 8.5a5.5 5.5 0 0 0 7.78 7.78L19 11z"/>
      <path d="m19 11 2 2a2 2 0 0 1 0 2.83L18 18"/>
      <path d="M3.5 15.5c0 .5.2 1 .5 1.4"/>
    </svg>
  )
}
function TextIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="4 7 4 4 20 4 20 7"/>
      <line x1="9" y1="20" x2="15" y2="20"/>
      <line x1="12" y1="4" x2="12" y2="20"/>
    </svg>
  )
}
function RectIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
    </svg>
  )
}
function CircleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/>
    </svg>
  )
}
function LineIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="5" y1="19" x2="19" y2="5"/>
    </svg>
  )
}
function UndoIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/>
    </svg>
  )
}
function RedoIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13"/>
    </svg>
  )
}