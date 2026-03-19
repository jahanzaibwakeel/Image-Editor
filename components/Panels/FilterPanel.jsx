'use client'

import { useEditorStore } from '@/store/editorStore'
import { FILTER_PRESETS } from '@/lib/filters'

export default function FilterPanel() {
  const { filters, updateFilters, resetFilters } = useEditorStore()

  const applyPreset = (preset) => updateFilters(preset.filters)

  return (
    <div className="p-4 space-y-5 fade-slide-in">
      {/* Presets */}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-500 mb-3">
          Presets
        </p>
        <div className="grid grid-cols-3 gap-2">
          {FILTER_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => applyPreset(preset)}
              className="flex flex-col items-center gap-1.5 group"
            >
              <div
                className="w-full aspect-square rounded-lg border-2 border-dark-500 group-hover:border-accent transition-colors"
                style={{ background: preset.thumb }}
              />
              <span className="text-[10px] text-gray-400 group-hover:text-white transition-colors">
                {preset.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-dark-600" />

      {/* Fine tune sliders */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">
            Fine-tune
          </p>
          <button
            onClick={resetFilters}
            className="text-[10px] text-accent hover:text-accent-light transition-colors"
          >
            Reset
          </button>
        </div>

        <div className="space-y-4">
          <FilterSlider label="Brightness" value={filters.brightness} min={0} max={200} onChange={(v) => updateFilters({ brightness: v })} />
          <FilterSlider label="Contrast"   value={filters.contrast}   min={0} max={200} onChange={(v) => updateFilters({ contrast: v })}   />
          <FilterSlider label="Saturation" value={filters.saturation} min={0} max={200} onChange={(v) => updateFilters({ saturation: v })} />
          <FilterSlider label="Sepia"      value={filters.sepia}      min={0} max={100} onChange={(v) => updateFilters({ sepia: v })}      />
          <FilterSlider label="Grayscale"  value={filters.grayscale}  min={0} max={100} onChange={(v) => updateFilters({ grayscale: v })}  />
          <FilterSlider label="Hue Rotate" value={filters.hueRotate}  min={0} max={360} onChange={(v) => updateFilters({ hueRotate: v })} unit="deg" />
          <FilterSlider label="Blur"       value={filters.blur}       min={0} max={20}  onChange={(v) => updateFilters({ blur: v })}       unit="px"  step={0.5} />
          <FilterSlider label="Invert"     value={filters.invert}     min={0} max={100} onChange={(v) => updateFilters({ invert: v })}     />
        </div>
      </div>
    </div>
  )
}

function FilterSlider({ label, value, min, max, onChange, unit = '%', step = 1 }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-[11px] text-gray-400">{label}</span>
        <span className="text-[11px] font-mono text-accent">
          {value}{unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
    </div>
  )
}