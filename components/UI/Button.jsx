'use client'

export default function Button({
  children,
  onClick,
  variant = 'default',
  size = 'md',
  disabled = false,
  className = '',
}) {
  const base = 'inline-flex items-center justify-center rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    default: 'bg-dark-600 hover:bg-dark-500 text-gray-300 hover:text-white border border-dark-400',
    accent:  'bg-accent hover:bg-accent-hover text-white shadow-lg shadow-accent/20',
    ghost:   'hover:bg-dark-600 text-gray-400 hover:text-white',
    danger:  'border border-red-500/40 text-red-400 hover:bg-red-500/10 hover:border-red-500',
  }

  const sizes = {
    sm: 'px-2.5 py-1 text-[11px]',
    md: 'px-3.5 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  )
}