'use client'

export default function Slider({ label, value, min = 0, max = 100, step = 1, unit = '', onChange }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <label className="text-[11px] text-gray-400">{label}</label>
        <span className="text-[11px] font-mono text-accent">{value}{unit}</span>
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