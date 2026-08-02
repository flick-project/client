/**
 * Reusable button component.
 * @param {object} props - Component props.
 * @param {React.ReactElement} props.children - Button content.
 * @param {'primary' | 'secondary' | 'danger' | 'ghost'} [props.variant] - Button style variant.
 * @param {'sm' | 'md' | 'lg'} [props.size] - Button size.
 * @param {boolean} [props.disabled] - Whether the button is disabled.
 * @param {boolean} [props.loading] - Whether the button is in a loading state.
 * @param {boolean} [props.full] - Whether the button should be full width.
 * @param {string} [props.className] - Additional CSS classes.
 * @returns {React.ReactElement} The Button component.
 */
export default function Button ({
  children,
  variant = 'primary',
  size = 'md',
  disabled,
  loading,
  full,
  className = '',
  ...rest
}) {
  const base = [
    'inline-flex items-center justify-center gap-2',
    'rounded-lg cursor-pointer',
    'transition-colors duration-150',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    full ? 'w-full' : '',
  ].join(' ')

  const sizes = {
    md: 'min-h-10 px-4 text-sm',
    lg: 'min-h-11 px-6 text-base',
  }

  const variants = {
    primary: 'font-semibold border border-transparent bg-brand hover:enabled:bg-red-700 text-white',
    secondary: 'font-medium border border-gray-600 text-gray-300 hover:enabled:bg-white/10 hover:enabled:border-gray-400',
    danger: 'font-medium border border-red-500/50 text-red-400 hover:enabled:bg-red-500/10 hover:enabled:border-red-400',
    ghost: 'font-medium border border-transparent text-text-muted hover:enabled:bg-white/10 hover:enabled:text-gray-200',
  }

  return (
    <button
      disabled={disabled || loading}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      {...rest}
    >
      {loading
        ? <span className='w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin' aria-label='Loading' />
        : children}
    </button>
  )
}
