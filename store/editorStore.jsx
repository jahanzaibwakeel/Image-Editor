import { create } from 'zustand'

export const useEditorStore = create((set) => ({
  // Active tool
  activeTool: 'brush',
  setActiveTool: (tool) => set({ activeTool: tool }),

  // Shared selected color
  selectedColor: '#000000',
  setSelectedColor: (color) =>
    set((s) => ({
      selectedColor: color,
      brush: {
        ...s.brush,
        color,
      },
      textSettings: {
        ...s.textSettings,
        color,
      },
      shapeSettings: {
        ...s.shapeSettings,
        strokeColor: color,
        fillColor: color,
      },
    })),

  // Brush settings
  brush: {
    size: 20,
    opacity: 100,
    color: '#000000',
    hardness: 80,
  },
  updateBrush: (patch) =>
    set((s) => ({
      brush: { ...s.brush, ...patch },
    })),

  // Text settings
  textSettings: {
    font: 'serif',
    size: 24,
    color: '#000000',
    bold: false,
    italic: false,
  },
  updateText: (patch) =>
    set((s) => ({
      textSettings: { ...s.textSettings, ...patch },
    })),

  // Shape settings
  shapeSettings: {
    fill: false,
    strokeColor: '#000000',
    fillColor: '#000000',
    strokeWidth: 2,
  },
  updateShape: (patch) =>
    set((s) => ({
      shapeSettings: { ...s.shapeSettings, ...patch },
    })),

  // Filter settings
  filters: {
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
    sepia: 0,
    grayscale: 0,
    hueRotate: 0,
    invert: 0,
  },
  updateFilters: (patch) =>
    set((s) => ({
      filters: { ...s.filters, ...patch },
    })),
  resetFilters: () =>
    set({
      filters: {
        brightness: 100,
        contrast: 100,
        saturation: 100,
        blur: 0,
        sepia: 0,
        grayscale: 0,
        hueRotate: 0,
        invert: 0,
      },
    }),

  // Canvas size
  canvasSize: { width: 1200, height: 800 },
  setCanvasSize: (size) => set({ canvasSize: size }),

  // Zoom
  zoom: 1,
  setZoom: (zoom) => set({ zoom }),
}))
