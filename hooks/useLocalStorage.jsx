import { useCallback } from 'react'
import toast from 'react-hot-toast'

const STORAGE_KEY = 'pixelforge_saves'
const MAX_SAVES   = 10

export function useLocalStorage(canvasRef) {
  // Get all saved projects
  const getSaves = useCallback(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  }, [])

  // Save current canvas state to localStorage
  const saveProject = useCallback((name = '') => {
    const canvas = canvasRef.current
    if (!canvas) return false
    try {
      const dataURL   = canvas.toDataURL('image/png')
      const saves     = getSaves()
      const label     = name.trim() || `Project ${saves.length + 1}`
      const entry = {
        id:        Date.now().toString(),
        name:      label,
        dataURL,
        savedAt:   new Date().toISOString(),
        width:     canvas.width,
        height:    canvas.height,
      }
      // Keep only the last MAX_SAVES entries
      const updated = [entry, ...saves].slice(0, MAX_SAVES)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      toast.success(`Saved as "${label}"`)
      return true
    } catch (err) {
      toast.error('Save failed — storage might be full')
      return false
    }
  }, [canvasRef, getSaves])

  // Load a saved project onto the canvas
  const loadProject = useCallback((entry) => {
    const canvas = canvasRef.current
    if (!canvas || !entry?.dataURL) return
    const img = new Image()
    img.onload = () => {
      const ctx = canvas.getContext('2d')
      canvas.width  = entry.width  || img.naturalWidth
      canvas.height = entry.height || img.naturalHeight
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0)
      toast.success(`Loaded "${entry.name}"`)
    }
    img.src = entry.dataURL
  }, [canvasRef])

  // Delete a saved project by id
  const deleteProject = useCallback((id) => {
    const updated = getSaves().filter((s) => s.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    toast.success('Project deleted')
  }, [getSaves])

  return { getSaves, saveProject, loadProject, deleteProject }
}
