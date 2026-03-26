// 'use client'

// import { useState, useRef, useEffect } from 'react'
// import Canvas from '@/components/Canvas/Canvas.jsx'
// import Toolbar from '@/components/Toolbar/Toolbar.jsx'
// import FilterPanel from '@/components/Panels/FilterPanel.jsx'
// import AdjustmentPanel from '@/components/Panels/AdjustmentPanel.jsx'
// import LayerPanel from '@/components/Panels/LayerPanel.jsx'
// import ExportPanel from '@/components/Panels/ExportPanel.jsx'
// import { useEditorStore } from '@/store/editorStore.jsx'
// import toast from 'react-hot-toast'

// export default function EditorPage() {
//   const canvasRef = useRef(null)
//   const fileInputRef = useRef(null)
//   const { setActiveTool } = useEditorStore()
//   const [activePanel, setActivePanel] = useState('filters')
//   const [showWelcome, setShowWelcome] = useState(true)

//   useEffect(() => {
//     const handleKey = (e) => {
//       if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
//       if (e.ctrlKey || e.metaKey) {
//         if (e.key === 'z') { e.preventDefault(); window.dispatchEvent(new CustomEvent('editor:undo')) }
//         if (e.key === 'y') { e.preventDefault(); window.dispatchEvent(new CustomEvent('editor:redo')) }
//         if (e.key === 's') { e.preventDefault(); window.dispatchEvent(new CustomEvent('editor:save')) }
//       } else {
//         const keyMap = { b: 'brush', e: 'eraser', t: 'text', r: 'rectangle', c: 'circle', l: 'line', f: 'fill' }
//         if (keyMap[e.key]) setActiveTool(keyMap[e.key])
//       }
//     }
//     window.addEventListener('keydown', handleKey)
//     return () => window.removeEventListener('keydown', handleKey)
//   }, [setActiveTool])

//   const handleUpload = (e) => {
//     const file = e.target.files?.[0]
//     if (!file) return
//     if (!file.type.startsWith('image/')) {
//       toast.error('Please upload a valid image file')
//       return
//     }
//     const reader = new FileReader()
//     reader.onload = (ev) => {
//       window.dispatchEvent(new CustomEvent('editor:loadImage', { detail: ev.target.result }))
//       setShowWelcome(false)
//       toast.success('Image loaded!')
//     }
//     reader.readAsDataURL(file)
//   }

//   const handleNewCanvas = () => {
//     window.dispatchEvent(new CustomEvent('editor:newCanvas'))
//     setShowWelcome(false)
//     toast.success('New canvas created!')
//   }

//   const panels = [
//     { id: 'filters',     label: 'Filters',  icon: '🎨' },
//     { id: 'adjustments', label: 'Adjust',   icon: '⚙️' },
//     { id: 'layers',      label: 'Layers',   icon: '🗂️' },
//     { id: 'export',      label: 'Export',   icon: '📤' },
//   ]

//   return (
//     <div className="flex flex-col h-screen overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>

//       {/* ── Top Header ── */}
//       <header
//         className="flex items-center justify-between px-4 shrink-0 z-50"
//         style={{
//           height: '52px',
//           background: 'linear-gradient(90deg, #7c3aed 0%, #4f46e5 50%, #0ea5e9 100%)',
//           boxShadow: '0 2px 20px rgba(124, 58, 237, 0.4)',
//         }}
//       >
//         {/* Logo */}
//         <div className="flex items-center gap-2">
//           <div
//             className="flex items-center justify-center rounded-lg"
//             style={{ width: '32px', height: '32px', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)' }}
//           >
//             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
//               <rect x="3" y="3" width="18" height="18" rx="2"/>
//               <circle cx="8.5" cy="8.5" r="1.5"/>
//               <polyline points="21 15 16 10 5 21"/>
//             </svg>
//           </div>
//           <div className="flex flex-col leading-tight">
//             <span className="text-white font-bold text-sm tracking-wide">PixelForge</span>
//             <span className="text-blue-200 text-xs opacity-80 hidden sm:block">Image Editor</span>
//           </div>
//         </div>

//         {/* Shortcuts — hidden on small screens */}
//         <div className="hidden md:flex items-center gap-4 text-xs text-white/60">
//           <span><kbd className="bg-white/10 px-1.5 py-0.5 rounded text-white/80">B</kbd> Brush</span>
//           <span><kbd className="bg-white/10 px-1.5 py-0.5 rounded text-white/80">E</kbd> Eraser</span>
//           <span><kbd className="bg-white/10 px-1.5 py-0.5 rounded text-white/80">T</kbd> Text</span>
//           <span><kbd className="bg-white/10 px-1.5 py-0.5 rounded text-white/80">Ctrl+Z</kbd> Undo</span>
//         </div>

//         {/* Actions */}
//         <div className="flex items-center gap-2">
//           <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
//           <button
//             onClick={() => fileInputRef.current?.click()}
//             className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
//             style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.25)' }}
//             onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
//             onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
//           >
//             <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//               <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
//             </svg>
//             <span className="hidden sm:inline">Open Image</span>
//           </button>
//           <button
//             onClick={handleNewCanvas}
//             className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
//             style={{ background: 'rgba(255,255,255,0.9)', color: '#4f46e5' }}
//             onMouseEnter={e => e.currentTarget.style.background = 'white'}
//             onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.9)'}
//           >
//             <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
//               <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
//             </svg>
//             <span className="hidden sm:inline">New Canvas</span>
//           </button>
//         </div>
//       </header>

//       {/* ── Main Layout ── */}
//       <div className="flex flex-1 min-h-0 overflow-hidden">

//         {/* Left Toolbar */}
//         <div
//           className="shrink-0 flex flex-col items-center py-3 gap-1 overflow-y-auto"
//           style={{
//             width: '52px',
//             background: 'linear-gradient(180deg, #312e81 0%, #1e1b4b 100%)',
//             borderRight: '1px solid rgba(139, 92, 246, 0.3)',
//             boxShadow: '2px 0 15px rgba(0,0,0,0.3)',
//           }}
//         >
//           <Toolbar />
//         </div>

//         {/* Canvas Area */}
//         <div
//           className="flex-1 min-w-0 relative flex items-center justify-center overflow-hidden"
//           style={{
//             background: 'radial-gradient(ellipse at center, #1e1b4b 0%, #0f0e1a 100%)',
//           }}
//         >
//           {/* Subtle grid background */}
//           <div
//             className="absolute inset-0 opacity-10"
//             style={{
//               backgroundImage: 'linear-gradient(rgba(139,92,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.3) 1px, transparent 1px)',
//               backgroundSize: '40px 40px',
//             }}
//           />

//           {/* Welcome Screen */}
//           {showWelcome && (
//             <div className="absolute inset-0 z-10 flex items-center justify-center p-4">
//               <div
//                 className="flex flex-col items-center gap-4 rounded-2xl w-full max-w-sm"
//                 style={{
//                   padding: 'clamp(1.5rem, 4vw, 2.5rem)',
//                   background: 'linear-gradient(135deg, rgba(49,46,129,0.95) 0%, rgba(30,27,75,0.98) 100%)',
//                   border: '1px solid rgba(139,92,246,0.4)',
//                   boxShadow: '0 25px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
//                   backdropFilter: 'blur(20px)',
//                 }}
//               >
//                 {/* Icon */}
//                 <div
//                   className="flex items-center justify-center rounded-2xl"
//                   style={{
//                     width: '64px', height: '64px',
//                     background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
//                     boxShadow: '0 8px 25px rgba(124,58,237,0.5)',
//                   }}
//                 >
//                   <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8">
//                     <rect x="3" y="3" width="18" height="18" rx="2"/>
//                     <circle cx="8.5" cy="8.5" r="1.5"/>
//                     <polyline points="21 15 16 10 5 21"/>
//                   </svg>
//                 </div>

//                 <div className="text-center">
//                   <h1 className="text-xl font-bold text-white mb-1">Welcome to PixelForge</h1>
//                   <p className="text-xs text-purple-300 leading-relaxed">
//                     Canvas-based image editor with filters, layers & local storage
//                   </p>
//                 </div>

//                 <div className="flex flex-col gap-2 w-full">
//                   <button
//                     onClick={() => fileInputRef.current?.click()}
//                     className="w-full py-2.5 rounded-xl text-white text-sm font-semibold transition-all"
//                     style={{
//                       background: 'linear-gradient(90deg, #7c3aed, #4f46e5)',
//                       boxShadow: '0 4px 15px rgba(124,58,237,0.4)',
//                     }}
//                     onMouseEnter={e => e.currentTarget.style.boxShadow = '0 6px 20px rgba(124,58,237,0.6)'}
//                     onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 15px rgba(124,58,237,0.4)'}
//                   >
//                     📁 Open Image from Computer
//                   </button>
//                   <button
//                     onClick={handleNewCanvas}
//                     className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all"
//                     style={{
//                       background: 'rgba(139,92,246,0.1)',
//                       color: '#c4b5fd',
//                       border: '1px solid rgba(139,92,246,0.3)',
//                     }}
//                     onMouseEnter={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.2)'; e.currentTarget.style.color = 'white' }}
//                     onMouseLeave={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.1)'; e.currentTarget.style.color = '#c4b5fd' }}
//                   >
//                     ✨ Start with Blank Canvas
//                   </button>
//                 </div>

//                 <div
//                   className="w-full rounded-lg p-2.5 text-center"
//                   style={{ background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.2)' }}
//                 >
//                   <p className="text-xs text-sky-400">
//                     ⌨️ Shortcuts: <span className="text-white">B</span> brush · <span className="text-white">E</span> eraser · <span className="text-white">T</span> text · <span className="text-white">Ctrl+Z</span> undo
//                   </p>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Canvas Wrapper — slightly bigger than the image */}
//           <div
//             className="relative z-0"
//             style={{
//               padding: '12px',
//               borderRadius: '12px',
//               background: 'rgba(30, 27, 75, 0.7)',
//               border: '1px solid rgba(139,92,246,0.25)',
//               boxShadow: '0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
//               backdropFilter: 'blur(4px)',
//             }}
//           >
//             <Canvas ref={canvasRef} />
//           </div>
//         </div>

//         {/* Right Panel */}
//         <div
//           className="shrink-0 flex flex-col overflow-hidden"
//           style={{
//             width: 'clamp(200px, 20vw, 260px)',
//             background: 'linear-gradient(180deg, #312e81 0%, #1e1b4b 100%)',
//             borderLeft: '1px solid rgba(139,92,246,0.3)',
//             boxShadow: '-2px 0 15px rgba(0,0,0,0.3)',
//           }}
//         >
//           {/* Panel Tabs */}
//           <div
//             className="grid shrink-0"
//             style={{
//               gridTemplateColumns: 'repeat(4, 1fr)',
//               borderBottom: '1px solid rgba(139,92,246,0.3)',
//               background: 'rgba(0,0,0,0.2)',
//             }}
//           >
//             {panels.map((p) => (
//               <button
//                 key={p.id}
//                 onClick={() => setActivePanel(p.id)}
//                 className="flex flex-col items-center justify-center gap-0.5 py-2 text-center transition-all"
//                 style={{
//                   fontSize: '9px',
//                   fontWeight: '700',
//                   textTransform: 'uppercase',
//                   letterSpacing: '0.05em',
//                   color: activePanel === p.id ? '#a78bfa' : 'rgba(167,139,250,0.4)',
//                   borderBottom: activePanel === p.id ? '2px solid #7c3aed' : '2px solid transparent',
//                   background: activePanel === p.id ? 'rgba(124,58,237,0.15)' : 'transparent',
//                 }}
//               >
//                 <span style={{ fontSize: '14px' }}>{p.icon}</span>
//                 <span>{p.label}</span>
//               </button>
//             ))}
//           </div>

//           {/* Panel Content */}
//           <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(139,92,246,0.4) transparent' }}>
//             {activePanel === 'filters'     && <FilterPanel     canvasRef={canvasRef} />}
//             {activePanel === 'adjustments' && <AdjustmentPanel canvasRef={canvasRef} />}
//             {activePanel === 'layers'      && <LayerPanel      canvasRef={canvasRef} />}
//             {activePanel === 'export'      && <ExportPanel     canvasRef={canvasRef} />}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

'use client'

import { useState, useRef, useEffect } from 'react'
import Canvas      from '@/components/Canvas/Canvas.jsx'
import Toolbar     from '@/components/Toolbar/Toolbar.jsx'
import FilterPanel     from '@/components/Panels/FilterPanel.jsx'
import AdjustmentPanel from '@/components/Panels/AdjustmentPanel.jsx'
import LayerPanel      from '@/components/Panels/LayerPanel.jsx'
import ExportPanel     from '@/components/Panels/ExportPanel.jsx'
import { useEditorStore } from '@/store/editorStore.jsx'
import toast from 'react-hot-toast'

export default function EditorPage() {
  const canvasRef    = useRef(null)
  const fileInputRef = useRef(null)
  const { setActiveTool } = useEditorStore()

  const [activePanel,  setActivePanel]  = useState('filters')
  const [showWelcome,  setShowWelcome]  = useState(true)

  // ── Keyboard shortcuts ──
  useEffect(() => {
    const handleKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z') { e.preventDefault(); window.dispatchEvent(new CustomEvent('editor:undo')) }
        if (e.key === 'y') { e.preventDefault(); window.dispatchEvent(new CustomEvent('editor:redo')) }
        if (e.key === 's') { e.preventDefault(); window.dispatchEvent(new CustomEvent('editor:save')) }
      } else {
        const keyMap = {
          b: 'brush', e: 'eraser', t: 'text',
          r: 'rectangle', c: 'circle', l: 'line', f: 'fill',
        }
        if (keyMap[e.key]) setActiveTool(keyMap[e.key])
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [setActiveTool])

  // ── Image upload ──
  const handleUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file')
      return
    }

    const reader    = new FileReader()

    reader.onload = (ev) => {
      const dataUrl = ev.target?.result
      if (!dataUrl) {
        console.error('[EditorPage] FileReader returned empty result')
        toast.error('Failed to read image')
        return
      }

      console.log('[EditorPage] FileReader success, dispatching loadImage event')

      // Small delay ensures canvas is fully mounted before we try to draw
      setTimeout(() => {
        window.dispatchEvent(
          new CustomEvent('editor:loadImage', { detail: dataUrl })
        )
      }, 50)

      setShowWelcome(false)
      toast.success('Image loaded!')
    }

    reader.onerror = () => {
      console.error('[EditorPage] FileReader error')
      toast.error('Failed to read image file')
    }

    reader.readAsDataURL(file)

    // Reset so same file can be re-selected
    e.target.value = ''
  }

  // ── New canvas ──
  const handleNewCanvas = () => {
    window.dispatchEvent(new CustomEvent('editor:newCanvas'))
    setShowWelcome(false)
    toast.success('New canvas created!')
  }

  const panels = [
    { id: 'filters',     label: 'Filters', icon: '🎨' },
    { id: 'adjustments', label: 'Adjust',  icon: '⚙️' },
    { id: 'layers',      label: 'Layers',  icon: '🗂️' },
    { id: 'export',      label: 'Export',  icon: '📤' },
  ]

  return (
    <div
      className="flex flex-col h-screen overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}
    >

      {/* ── Top Header ── */}
      <header
        className="flex items-center justify-between px-4 shrink-0 z-50"
        style={{
          height:     '52px',
          background: 'linear-gradient(90deg, #7c3aed 0%, #4f46e5 50%, #0ea5e9 100%)',
          boxShadow:  '0 2px 20px rgba(124,58,237,0.4)',
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div
            className="flex items-center justify-center rounded-lg"
            style={{
              width: '32px', height: '32px',
              background:    'rgba(255,255,255,0.2)',
              backdropFilter:'blur(10px)',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-white font-bold text-sm tracking-wide">PixelForge</span>
            <span className="text-blue-200 text-xs opacity-80 hidden sm:block">Image Editor</span>
          </div>
        </div>

        {/* Keyboard shortcuts hint */}
        <div className="hidden md:flex items-center gap-4 text-xs text-white/60">
          <span><kbd className="bg-white/10 px-1.5 py-0.5 rounded text-white/80">B</kbd> Brush</span>
          <span><kbd className="bg-white/10 px-1.5 py-0.5 rounded text-white/80">E</kbd> Eraser</span>
          <span><kbd className="bg-white/10 px-1.5 py-0.5 rounded text-white/80">T</kbd> Text</span>
          <span><kbd className="bg-white/10 px-1.5 py-0.5 rounded text-white/80">Ctrl+Z</kbd> Undo</span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
            style={{
              background: 'rgba(255,255,255,0.15)',
              color:      'white',
              border:     '1px solid rgba(255,255,255,0.25)',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            <span className="hidden sm:inline">Open Image</span>
          </button>

          <button
            onClick={handleNewCanvas}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
            style={{ background: 'rgba(255,255,255,0.9)', color: '#4f46e5' }}
            onMouseEnter={e => e.currentTarget.style.background = 'white'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.9)'}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            <span className="hidden sm:inline">New Canvas</span>
          </button>
        </div>
      </header>

      {/* ── Main Layout ── */}
      <div className="flex flex-1 min-h-0 overflow-hidden">

        {/* Left Toolbar */}
        <div
          className="shrink-0 flex flex-col items-center py-3 gap-1 overflow-y-auto"
          style={{
            width:       '52px',
            background:  'linear-gradient(180deg, #312e81 0%, #1e1b4b 100%)',
            borderRight: '1px solid rgba(139,92,246,0.3)',
            boxShadow:   '2px 0 15px rgba(0,0,0,0.3)',
          }}
        >
          <Toolbar />
        </div>

        {/* Canvas Area */}
        <div
          className="flex-1 min-w-0 relative flex items-center justify-center overflow-hidden"
          style={{
            background: 'radial-gradient(ellipse at center, #1e1b4b 0%, #0f0e1a 100%)',
          }}
        >
          {/* Subtle grid pattern */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(rgba(139,92,246,0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(139,92,246,0.3) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
            }}
          />

          {/* ── Welcome Screen ── */}
          {showWelcome && (
            <div className="absolute inset-0 z-10 flex items-center justify-center p-4">
              <div
                className="flex flex-col items-center gap-4 rounded-2xl w-full max-w-sm"
                style={{
                  padding:       'clamp(1.5rem, 4vw, 2.5rem)',
                  background:    'linear-gradient(135deg, rgba(49,46,129,0.95) 0%, rgba(30,27,75,0.98) 100%)',
                  border:        '1px solid rgba(139,92,246,0.4)',
                  boxShadow:     '0 25px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
                  backdropFilter:'blur(20px)',
                }}
              >
                <div
                  className="flex items-center justify-center rounded-2xl"
                  style={{
                    width:     '64px',
                    height:    '64px',
                    background:'linear-gradient(135deg, #7c3aed, #4f46e5)',
                    boxShadow: '0 8px 25px rgba(124,58,237,0.5)',
                  }}
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                </div>

                <div className="text-center">
                  <h1 className="text-xl font-bold text-white mb-1">Welcome to PixelForge</h1>
                  <p className="text-xs text-purple-300 leading-relaxed">
                    Canvas-based image editor with filters, layers &amp; local storage
                  </p>
                </div>

                <div className="flex flex-col gap-2 w-full">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-2.5 rounded-xl text-white text-sm font-semibold transition-all"
                    style={{
                      background: 'linear-gradient(90deg, #7c3aed, #4f46e5)',
                      boxShadow:  '0 4px 15px rgba(124,58,237,0.4)',
                    }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow = '0 6px 20px rgba(124,58,237,0.6)'}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 15px rgba(124,58,237,0.4)'}
                  >
                    📁 Open Image from Computer
                  </button>

                  <button
                    onClick={handleNewCanvas}
                    className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all"
                    style={{
                      background: 'rgba(139,92,246,0.1)',
                      color:      '#c4b5fd',
                      border:     '1px solid rgba(139,92,246,0.3)',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'rgba(139,92,246,0.2)'
                      e.currentTarget.style.color      = 'white'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'rgba(139,92,246,0.1)'
                      e.currentTarget.style.color      = '#c4b5fd'
                    }}
                  >
                    ✨ Start with Blank Canvas
                  </button>
                </div>

                <div
                  className="w-full rounded-lg p-2.5 text-center"
                  style={{
                    background: 'rgba(14,165,233,0.1)',
                    border:     '1px solid rgba(14,165,233,0.2)',
                  }}
                >
                  <p className="text-xs text-sky-400">
                    ⌨️ Shortcuts:{' '}
                    <span className="text-white">B</span> brush ·{' '}
                    <span className="text-white">E</span> eraser ·{' '}
                    <span className="text-white">T</span> text ·{' '}
                    <span className="text-white">Ctrl+Z</span> undo
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ── Canvas Wrapper ── */}
          <div
            className="relative z-0"
            style={{
              padding:       '12px',
              borderRadius:  '12px',
              background:    'rgba(30,27,75,0.7)',
              border:        '1px solid rgba(139,92,246,0.25)',
              boxShadow:     '0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
              backdropFilter:'blur(4px)',
            }}
          >
            <Canvas ref={canvasRef} />
          </div>
        </div>

        {/* Right Panel */}
        <div
          className="shrink-0 flex flex-col overflow-hidden"
          style={{
            width:      'clamp(200px, 20vw, 260px)',
            background: 'linear-gradient(180deg, #312e81 0%, #1e1b4b 100%)',
            borderLeft: '1px solid rgba(139,92,246,0.3)',
            boxShadow:  '-2px 0 15px rgba(0,0,0,0.3)',
          }}
        >
          {/* Panel Tabs */}
          <div
            className="grid shrink-0"
            style={{
              gridTemplateColumns: 'repeat(4, 1fr)',
              borderBottom:        '1px solid rgba(139,92,246,0.3)',
              background:          'rgba(0,0,0,0.2)',
            }}
          >
            {panels.map((p) => (
              <button
                key={p.id}
                onClick={() => setActivePanel(p.id)}
                className="flex flex-col items-center justify-center gap-0.5 py-2 text-center transition-all"
                style={{
                  fontSize:       '9px',
                  fontWeight:     '700',
                  textTransform:  'uppercase',
                  letterSpacing:  '0.05em',
                  color:          activePanel === p.id ? '#a78bfa' : 'rgba(167,139,250,0.4)',
                  borderBottom:   activePanel === p.id ? '2px solid #7c3aed' : '2px solid transparent',
                  background:     activePanel === p.id ? 'rgba(124,58,237,0.15)' : 'transparent',
                }}
              >
                <span style={{ fontSize: '14px' }}>{p.icon}</span>
                <span>{p.label}</span>
              </button>
            ))}
          </div>

          {/* Panel Content */}
          <div
            className="flex-1 overflow-y-auto"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(139,92,246,0.4) transparent',
            }}
          >
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