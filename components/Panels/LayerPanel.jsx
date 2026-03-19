'use client'

import { useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import { useLocalStorage } from '@/hooks/useLocalStorage'

export default function LayerPanel({ canvasRef }) {
  const { getSaves, saveProject, loadProject, deleteProject } = useLocalStorage(
    // Expose canvas via getter
    { current: { getCanvas: () => canvasRef?.current?.getCanvas?.() } }
  )
  const [saves,     setSaves]    = useState(() => getSaves())
  const [saveName,  setSaveName] = useState('')
  const [showSaves, setShowSaves] = useState(false)

  const handleSave = useCallback(() => {
    const canvas = canvasRef?.current?.getCanvas?.()
    const ref    = { current: canvas }
    const { saveProject: sp } = useLocalStorageRaw(ref)
    sp(saveName)
    setSaves(getSaves())
    setSaveName('')
  }, [canvasRef, saveName, getSaves])

  const refresh = () => setSaves(getSaves())

  return (
    <div className="p-4 space-y-5 fade-slide-in">
      {/* Save Project */}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-500 mb-3">
          Save to Local Storage
        </p>
        <input
          type="text"
          value={saveName}
          onChange={(e) => setSaveName(e.target.value)}
          placeholder="Project name (optional)"
          className="w-full bg-dark-600 text-white text-sm px-3 py-2 rounded-lg border border-dark-400 focus:border-accent outline-none mb-2"
        />
        <SaveButton canvasRef={canvasRef} name={saveName} onSaved={() => { setSaveName(''); refresh() }} />
      </div>

      <div className="h-px bg-dark-600" />

      {/* Saved Projects */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">
            Saved Projects ({saves.length}/10)
          </p>
          <button
            onClick={refresh}
            className="text-[10px] text-accent hover:text-accent-light transition-colors"
          >
            Refresh
          </button>
        </div>

        {saves.length === 0 ? (
          <p className="text-[12px] text-gray-600 text-center py-4">
            No saved projects yet
          </p>
        ) : (
          <div className="space-y-2">
            {saves.map((save) => (
              <SaveEntry
                key={save.id}
                save={save}
                canvasRef={canvasRef}
                onDelete={() => { deleteProject(save.id); refresh() }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Save Button (uses hook cleanly) ──
function SaveButton({ canvasRef, name, onSaved }) {
  const canvas = canvasRef?.current?.getCanvas?.()
  const ref    = { current: canvas }
  const { saveProject } = useLocalStorage(ref)

  return (
    <button
      onClick={() => { saveProject(name); onSaved() }}
      className="w-full py-2 text-sm rounded-lg bg-accent hover:bg-accent-hover text-white transition-all"
    >
      Save Current Canvas
    </button>
  )
}

// ── Save Entry ──
function SaveEntry({ save, canvasRef, onDelete }) {
  const canvas = canvasRef?.current?.getCanvas?.()
  const ref    = { current: canvas }
  const { loadProject } = useLocalStorage(ref)

  return (
    <div className="p-2.5 rounded-lg bg-dark-700 border border-dark-500 hover:border-dark-400 transition-colors group">
      <div className="flex items-center gap-2">
        {save.dataURL && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={save.dataURL}
            alt={save.name}
            className="w-10 h-10 object-cover rounded-md border border-dark-500"
          />
        )}
        <div className="flex-1 min-w-0">
          <p className="text-[12px] text-white font-medium truncate">{save.name}</p>
          <p className="text-[10px] text-gray-500">
            {save.width} x {save.height} &bull; {new Date(save.savedAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      <div className="flex gap-2 mt-2">
        <button
          onClick={() => loadProject(save)}
          className="flex-1 py-1 text-[11px] rounded-md bg-dark-600 hover:bg-accent hover:text-white text-gray-300 transition-all border border-dark-500"
        >
          Load
        </button>
        <button
          onClick={onDelete}
          className="px-2 py-1 text-[11px] rounded-md bg-dark-600 hover:bg-red-500/20 hover:text-red-400 text-gray-400 transition-all border border-dark-500"
        >
          Del
        </button>
      </div>
    </div>
  )
}

// Workaround to use hook outside component
function useLocalStorageRaw(ref) {
  return useLocalStorage(ref)
}