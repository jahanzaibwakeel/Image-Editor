import { create } from 'zustand'

export const useEditorStore = create((set) => ({
  // Active tool
  activeTool: 'brush',
  setActiveTool: (tool) => set({ activeTool: tool }),

  // Brush settings
  brush: {
    size:    20,
    opacity: 100,
    color:   '#ffffff',
    hardness: 80,
  },
  updateBrush: (patch) =>
    set((s) => ({ brush: { ...s.brush, ...patch } })),

  // Text settings
  textSettings: {
    font:   'serif',
    size:   24,
    color:  '#ffffff',
    bold:   false,
    italic: false,
  },
  updateText: (patch) =>
    set((s) => ({ textSettings: { ...s.textSettings, ...patch } })),

  // Shape settings
  shapeSettings: {
    fill:        false,
    strokeColor: '#ffffff',
    strokeWidth: 2,
  },
  updateShape: (patch) =>
    set((s) => ({ shapeSettings: { ...s.shapeSettings, ...patch } })),

  // Filter settings
  filters: {
    brightness: 100,
    contrast:   100,
    saturation: 100,
    blur:       0,
    sepia:      0,
    grayscale:  0,
    hueRotate:  0,
    invert:     0,
  },
  updateFilters: (patch) =>
    set((s) => ({ filters: { ...s.filters, ...patch } })),
  resetFilters: () =>
    set({
      filters: {
        brightness: 100,
        contrast:   100,
        saturation: 100,
        blur:       0,
        sepia:      0,
        grayscale:  0,
        hueRotate:  0,
        invert:     0,
      },
    }),

  // Canvas size
  canvasSize: { width: 1200, height: 800 },
  setCanvasSize: (size) => set({ canvasSize: size }),

  // Zoom
  zoom: 1,
  setZoom: (zoom) => set({ zoom }),
}))
