// Preset filter definitions
export const FILTER_PRESETS = [
  {
    id:    'original',
    label: 'Original',
    thumb: 'linear-gradient(135deg, #667eea, #764ba2)',
    filters: {
      brightness: 100, contrast: 100, saturation: 100,
      blur: 0, sepia: 0, grayscale: 0, hueRotate: 0, invert: 0,
    },
  },
  {
    id:    'vivid',
    label: 'Vivid',
    thumb: 'linear-gradient(135deg, #f7971e, #ffd200)',
    filters: {
      brightness: 110, contrast: 120, saturation: 150,
      blur: 0, sepia: 0, grayscale: 0, hueRotate: 0, invert: 0,
    },
  },
  {
    id:    'noir',
    label: 'Noir',
    thumb: 'linear-gradient(135deg, #232526, #414345)',
    filters: {
      brightness: 90, contrast: 130, saturation: 0,
      blur: 0, sepia: 0, grayscale: 100, hueRotate: 0, invert: 0,
    },
  },
  {
    id:    'vintage',
    label: 'Vintage',
    thumb: 'linear-gradient(135deg, #d4a96a, #8b5e3c)',
    filters: {
      brightness: 105, contrast: 90, saturation: 80,
      blur: 0, sepia: 60, grayscale: 0, hueRotate: 0, invert: 0,
    },
  },
  {
    id:    'cool',
    label: 'Cool',
    thumb: 'linear-gradient(135deg, #4facfe, #00f2fe)',
    filters: {
      brightness: 100, contrast: 100, saturation: 110,
      blur: 0, sepia: 0, grayscale: 0, hueRotate: 200, invert: 0,
    },
  },
  {
    id:    'warm',
    label: 'Warm',
    thumb: 'linear-gradient(135deg, #f6d365, #fda085)',
    filters: {
      brightness: 110, contrast: 100, saturation: 120,
      blur: 0, sepia: 20, grayscale: 0, hueRotate: 350, invert: 0,
    },
  },
  {
    id:    'dreamy',
    label: 'Dreamy',
    thumb: 'linear-gradient(135deg, #a18cd1, #fbc2eb)',
    filters: {
      brightness: 115, contrast: 85, saturation: 130,
      blur: 0.5, sepia: 10, grayscale: 0, hueRotate: 0, invert: 0,
    },
  },
  {
    id:    'fade',
    label: 'Fade',
    thumb: 'linear-gradient(135deg, #cfd9df, #e2ebf0)',
    filters: {
      brightness: 120, contrast: 75, saturation: 70,
      blur: 0, sepia: 0, grayscale: 0, hueRotate: 0, invert: 0,
    },
  },
  {
    id:    'dramatic',
    label: 'Dramatic',
    thumb: 'linear-gradient(135deg, #0f0c29, #302b63)',
    filters: {
      brightness: 85, contrast: 150, saturation: 80,
      blur: 0, sepia: 0, grayscale: 0, hueRotate: 0, invert: 0,
    },
  },
]

// Build a CSS filter string from filter settings
export function buildFilterString(f) {
  return [
    `brightness(${f.brightness}%)`,
    `contrast(${f.contrast}%)`,
    `saturate(${f.saturation}%)`,
    `blur(${f.blur}px)`,
    `sepia(${f.sepia}%)`,
    `grayscale(${f.grayscale}%)`,
    `hue-rotate(${f.hueRotate}deg)`,
    `invert(${f.invert}%)`,
  ].join(' ')
}
