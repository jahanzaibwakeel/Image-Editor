
'use client'

import { useRef } from 'react'
import { useEditorStore } from '@/store/editorStore.jsx'

const tools = [
  { id: 'select', icon: '↖', label: 'Select (V)' },
  { id: 'brush', icon: '✏️', label: 'Brush (B)' },
  { id: 'eraser', icon: '⬜', label: 'Eraser (E)' },
  { id: 'fill', icon: '🪣', label: 'Fill (F)' },
  { id: 'text', icon: 'T', label: 'Text (T)' },
  { id: 'rectangle', icon: '▭', label: 'Rectangle (R)' },
  { id: 'circle', icon: '○', label: 'Circle (C)' },
  { id: 'line', icon: '╱', label: 'Line (L)' },
]

export default function Toolbar() {
  const activeTool = useEditorStore((s) => s.activeTool)
  const setActiveTool = useEditorStore((s) => s.setActiveTool)

  const selectedColor = useEditorStore((s) => s.selectedColor)
  const setSelectedColor = useEditorStore((s) => s.setSelectedColor)

  const brush = useEditorStore((s) => s.brush)
  const updateBrush = useEditorStore((s) => s.updateBrush)

  const shapeSettings = useEditorStore((s) => s.shapeSettings)
  const updateShape = useEditorStore((s) => s.updateShape)

  const textSettings = useEditorStore((s) => s.textSettings)
  const updateText = useEditorStore((s) => s.updateText)

  const colorInputRef = useRef(null)

  const handleColorChange = (value) => {
    setSelectedColor(value)
  }

  const handleBrushSize = (value) => {
    if (['brush', 'eraser', 'fill'].includes(activeTool)) {
      updateBrush({ size: value })
    } else if (['rectangle', 'circle', 'line'].includes(activeTool)) {
      updateShape({ strokeWidth: value })
    }
  }

  const handleFillToggle = () => {
    updateShape({ fill: !shapeSettings.fill })
  }

  const handleFontSize = (value) => {
    updateText({ size: value })
  }

  const handleFontStyle = (value) => {
    updateText({
      bold: value.includes('bold'),
      italic: value.includes('italic'),
    })
  }

  const presets = [
    '#ffffff', '#000000', '#ef4444', '#f97316',
    '#eab308', '#22c55e', '#06b6d4', '#3b82f6',
    '#a855f7', '#ec4899', '#f43f5e', '#84cc16',
  ]

  const isShape = ['rectangle', 'circle', 'line'].includes(activeTool)
  const isText = activeTool === 'text'
  const isBrush = activeTool === 'brush'
  const isEraser = activeTool === 'eraser'

  const currentFontStyle =
    textSettings.bold && textSettings.italic
      ? 'bold italic'
      : textSettings.bold
        ? 'bold'
        : textSettings.italic
          ? 'italic'
          : 'normal'

  return (
    <div
      className="flex flex-col items-center w-full gap-1 overflow-y-auto pb-3"
      style={{ scrollbarWidth: 'none' }}
    >
      {/* ── Tool Buttons ── */}
      <div className="flex flex-col items-center gap-1 w-full px-1.5 pt-1">
        {tools.map((tool) => (
          <button
            key={tool.id}
            title={tool.label}
            onClick={() => setActiveTool(tool.id)}
            className="w-full flex items-center justify-center rounded-lg transition-all"
            style={{
              height: '38px',
              fontSize: tool.id === 'text' ? '14px' : '16px',
              fontWeight: tool.id === 'text' ? '900' : 'normal',
              background:
                activeTool === tool.id
                  ? 'linear-gradient(135deg, #7c3aed, #4f46e5)'
                  : 'rgba(139,92,246,0.08)',
              color: activeTool === tool.id ? '#ffffff' : 'rgba(196,181,253,0.7)',
              border:
                activeTool === tool.id
                  ? '1px solid rgba(167,139,250,0.5)'
                  : '1px solid transparent',
              boxShadow:
                activeTool === tool.id
                  ? '0 4px 12px rgba(124,58,237,0.4)'
                  : 'none',
            }}
            onMouseEnter={(e) => {
              if (activeTool !== tool.id) {
                e.currentTarget.style.background = 'rgba(139,92,246,0.2)'
                e.currentTarget.style.color = '#c4b5fd'
              }
            }}
            onMouseLeave={(e) => {
              if (activeTool !== tool.id) {
                e.currentTarget.style.background = 'rgba(139,92,246,0.08)'
                e.currentTarget.style.color = 'rgba(196,181,253,0.7)'
              }
            }}
          >
            {tool.icon}
          </button>
        ))}
      </div>

      <div
        className="w-4/5 my-1"
        style={{ height: '1px', background: 'rgba(139,92,246,0.25)' }}
      />

      {/* ── Colour Swatch Button ── */}
      <div className="flex flex-col items-center gap-1 w-full px-1.5">
        <span
          style={{
            fontSize: '9px',
            color: 'rgba(196,181,253,0.5)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        >
          Color
        </span>

        <button
          title="Pick colour"
          onClick={() => colorInputRef.current?.click()}
          className="rounded-lg transition-all"
          style={{
            width: '36px',
            height: '36px',
            background: selectedColor,
            border: '2px solid rgba(255,255,255,0.3)',
            boxShadow: `0 0 12px ${selectedColor}88`,
            position: 'relative',
          }}
        >
          <input
            ref={colorInputRef}
            type="color"
            value={selectedColor}
            onChange={(e) => handleColorChange(e.target.value)}
            style={{
              opacity: 0,
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              cursor: 'pointer',
            }}
          />
        </button>

        <span
          style={{
            fontSize: '9px',
            color: 'rgba(196,181,253,0.6)',
            fontFamily: 'monospace',
          }}
        >
          {selectedColor.toUpperCase()}
        </span>

        <div
          className="grid gap-1 w-full px-0.5"
          style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}
        >
          {presets.map((c) => (
            <button
              key={c}
              title={c}
              onClick={() => handleColorChange(c)}
              className="rounded transition-all"
              style={{
                height: '18px',
                background: c,
                border:
                  selectedColor === c
                    ? '2px solid white'
                    : '1px solid rgba(255,255,255,0.15)',
                boxShadow: selectedColor === c ? `0 0 6px ${c}` : 'none',
              }}
            />
          ))}
        </div>
      </div>

      <div
        className="w-4/5 my-1"
        style={{ height: '1px', background: 'rgba(139,92,246,0.25)' }}
      />

      {/* ── Brush Size ── */}
      {(isBrush || isEraser) && (
        <div className="flex flex-col items-center gap-1 w-full px-1.5">
          <span
            style={{
              fontSize: '9px',
              color: 'rgba(196,181,253,0.5)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            Size · {brush.size}px
          </span>

          <input
            type="range"
            min="1"
            max="60"
            value={brush.size}
            onChange={(e) => handleBrushSize(Number(e.target.value))}
            className="w-full"
            style={{ accentColor: '#7c3aed', height: '4px' }}
          />

          <div
            style={{
              width: `${Math.min(brush.size, 36)}px`,
              height: `${Math.min(brush.size, 36)}px`,
              borderRadius: '50%',
              background: isEraser ? 'rgba(255,255,255,0.2)' : selectedColor,
              border: isEraser ? '1px dashed rgba(255,255,255,0.4)' : 'none',
              transition: 'all 0.15s ease',
            }}
          />
        </div>
      )}

      {/* ── Shape Options ── */}
      {isShape && (
        <div className="flex flex-col items-center gap-1.5 w-full px-1.5">
          <span
            style={{
              fontSize: '9px',
              color: 'rgba(196,181,253,0.5)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            Stroke · {shapeSettings.strokeWidth}px
          </span>

          <input
            type="range"
            min="1"
            max="20"
            value={shapeSettings.strokeWidth}
            onChange={(e) => handleBrushSize(Number(e.target.value))}
            className="w-full"
            style={{ accentColor: '#7c3aed', height: '4px' }}
          />

          <button
            onClick={handleFillToggle}
            className="w-full py-1.5 rounded-lg text-xs font-bold transition-all"
            style={{
              background: shapeSettings.fill
                ? 'linear-gradient(135deg, #7c3aed, #4f46e5)'
                : 'rgba(139,92,246,0.1)',
              color: shapeSettings.fill ? 'white' : '#a78bfa',
              border: '1px solid rgba(139,92,246,0.3)',
              fontSize: '10px',
            }}
          >
            {shapeSettings.fill ? '⬛ Filled' : '⬜ Outline'}
          </button>
        </div>
      )}

      {/* ── Text Options ── */}
      {isText && (
        <div className="flex flex-col items-center gap-1.5 w-full px-1.5">
          <span
            style={{
              fontSize: '9px',
              color: 'rgba(196,181,253,0.5)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            Font Size · {textSettings.size}px
          </span>

          <input
            type="range"
            min="10"
            max="120"
            value={textSettings.size}
            onChange={(e) => handleFontSize(Number(e.target.value))}
            className="w-full"
            style={{ accentColor: '#7c3aed', height: '4px' }}
          />

          <div
            className="grid w-full gap-1"
            style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}
          >
            {['normal', 'bold', 'italic', 'bold italic'].map((fs) => (
              <button
                key={fs}
                onClick={() => handleFontStyle(fs)}
                className="py-1 rounded-lg transition-all"
                style={{
                  fontSize: '10px',
                  fontWeight: fs.includes('bold') ? 'bold' : 'normal',
                  fontStyle: fs.includes('italic') ? 'italic' : 'normal',
                  background:
                    currentFontStyle === fs
                      ? 'linear-gradient(135deg, #7c3aed, #4f46e5)'
                      : 'rgba(139,92,246,0.1)',
                  color: currentFontStyle === fs ? 'white' : '#a78bfa',
                  border: '1px solid rgba(139,92,246,0.3)',
                  textTransform: 'capitalize',
                }}
              >
                {fs === 'bold italic' ? 'B+I' : fs.charAt(0).toUpperCase() + fs.slice(1)}
              </button>
            ))}
          </div>

          <div
            className="w-full rounded-lg p-1.5 text-center overflow-hidden"
            style={{
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid rgba(139,92,246,0.2)',
            }}
          >
            <span
              style={{
                color: selectedColor,
                fontSize: `${Math.min(textSettings.size, 22)}px`,
                fontWeight: textSettings.bold ? 'bold' : 'normal',
                fontStyle: textSettings.italic ? 'italic' : 'normal',
              }}
            >
              Aa
            </span>
          </div>
        </div>
      )}

      <div
        className="w-4/5 my-1"
        style={{ height: '1px', background: 'rgba(139,92,246,0.25)' }}
      />

      {/* ── Undo / Redo ── */}
      <div className="flex flex-col items-center gap-1 w-full px-1.5">
        <button
          title="Undo (Ctrl+Z)"
          onClick={() => window.dispatchEvent(new CustomEvent('editor:undo'))}
          className="w-full flex items-center justify-center rounded-lg py-2 transition-all"
          style={{
            background: 'rgba(139,92,246,0.08)',
            color: 'rgba(196,181,253,0.7)',
            fontSize: '13px',
            border: '1px solid transparent',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(139,92,246,0.2)'
            e.currentTarget.style.color = '#c4b5fd'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(139,92,246,0.08)'
            e.currentTarget.style.color = 'rgba(196,181,253,0.7)'
          }}
        >
          ↩ Undo
        </button>

        <button
          title="Redo (Ctrl+Y)"
          onClick={() => window.dispatchEvent(new CustomEvent('editor:redo'))}
          className="w-full flex items-center justify-center rounded-lg py-2 transition-all"
          style={{
            background: 'rgba(139,92,246,0.08)',
            color: 'rgba(196,181,253,0.7)',
            fontSize: '13px',
            border: '1px solid transparent',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(139,92,246,0.2)'
            e.currentTarget.style.color = '#c4b5fd'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(139,92,246,0.08)'
            e.currentTarget.style.color = 'rgba(196,181,253,0.7)'
          }}
        >
          ↪ Redo
        </button>
      </div>
    </div>
  )
}
