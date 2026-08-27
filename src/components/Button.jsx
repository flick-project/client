import { Loader2 } from 'lucide-react'

/**
 * Rectangular action button with variant and size support.
 * Follows shadcn conventions: disabled via pointer-events-none (no hover:enabled: needed),
 * no transition classes on interactive elements, icon rendered via children or icon prop.
 * @param {object} props - Component props.
 * @param {React.ReactNode} props.children - Button label.
 * @param {() => void} [props.onClick] - Click handler.
 * @param {'primary'|'secondary'|'danger'|'ghost'} [props.variant] - Visual style.
 * @param {'sm'|'md'|'lg'} [props.size] - Height and padding.
 * @param {React.ReactNode} [props.icon] - Icon element shown before children (or after, with iconPosition).
 * @param {'left'|'right'} [props.iconPosition] - Icon placement.
 * @param {boolean} [props.full] - Stretch to container width.
 * @param {boolean} [props.disabled] - Disables interaction and dims the button.
 * @param {boolean} [props.loading] - Shows a spinner and disables interaction.
 * @param {'button'|'submit'|'reset'} [props.type] - HTML button type.
 * @param {string} [props.className] - Extra classes merged last.
 * @returns {React.ReactElement} The Button component.
 */
export default function Button ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  full = false,
  disabled = false,
  loading = false,
  type = 'button',
  className = '',
  ...rest
}) {
  const isDisabled = disabled || loading

  const variants = {
    primary: 'bg-brand font-semibold text-white hover:bg-red-700',
    secondary: 'font-medium text-gray-300 border border-gray-600 hover:bg-white/5 hover:border-gray-500',
    danger: 'font-medium text-red-400 border border-red-500/40 hover:bg-red-500/5 hover:border-red-400/60',
    ghost: 'font-medium text-gray-400 hover:bg-white/10 hover:text-gray-200'
  }

  const sizes = {
    sm: 'h-9 px-3 text-sm gap-1.5 rounded-sm',
    md: 'h-11 px-4 text-sm gap-2 rounded-md',
    lg: 'h-12 px-5 text-base gap-2.5 rounded-lg'
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`inline-flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-light ${variants[variant]} ${sizes[size]} ${full ? 'w-full' : ''} ${className}`}
      {...rest}
    >
      {loading
        ? <Loader2 className='size-4 animate-spin' aria-hidden='true' />
        : icon && iconPosition === 'left' && <span className='shrink-0' aria-hidden='true'>{icon}</span>}
      {children}
      {!loading && icon && iconPosition === 'right' && (
        <span className='shrink-0' aria-hidden='true'>{icon}</span>
      )}
    </button>
  )
}
