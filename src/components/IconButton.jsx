const sizes = {
  sm: { padding: 'p-3', iconSize: 24 },
  md: { padding: 'p-3.5', iconSize: 28 },
  lg: { padding: 'p-4', iconSize: 32 },
}

/**
 * Reusable icon button component.
 * @param {object} props - Component props.
 * @param {React.ComponentType} props.icon - Lucide icon component.
 * @param {string} [props.backgroundColor] - Tailwind background color class.
 * @param {string} [props.hoverBg] - Tailwind hover background color class.
 * @param {string} [props.textColor] - Tailwind text color class.
 * @param {string} [props.hoverColor] - Tailwind hover text color class.
 * @param {number} [props.strokeWidth] - Icon stroke width.
 * @param {boolean} [props.ghost] - Renders without background for minimal nav buttons.
 * @param {boolean} [props.filled] - Whether to fill the icon.
 * @param {'sm' | 'md' | 'lg'} [props.size] - Button size.
 * @param {boolean} [props.disabled] - Whether the button is disabled.
 * @param {string} [props.className] - Additional CSS classes.
 * @returns {React.ReactElement} The IconButton component.
 */
export default function IconButton ({
  icon: Icon,
  backgroundColor = 'backdrop-blur-sm bg-white/10',
  hoverBg = 'hover:bg-white/20',
  textColor = 'text-foreground',
  strokeWidth = 2,
  ghost = false,
  filled = false,
  size = 'sm',
  disabled,
  className = '',
  iconShadow = '',
  ...rest
}) {
  const { padding, iconSize } = sizes[size] ?? sizes.md

  return (
    <button
      disabled={disabled}
      className={[
        'flex items-center justify-center aspect-square rounded-full',
        'disabled:opacity-30 disabled:cursor-not-allowed',
        disabled ? '' : `cursor-pointer ${hoverBg}`,
        padding,
        ghost ? '' : `${backgroundColor}`,
        textColor,
        className,
      ].join(' ')}
      {...rest}
    >
      <Icon size={iconSize} strokeWidth={strokeWidth} fill={filled ? 'currentColor' : 'none'} className={`${iconShadow}`} />
    </button>
  )
}
