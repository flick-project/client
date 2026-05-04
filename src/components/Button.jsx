/**
 * Reusable button component.
 * @param {object} props - Component props.
 * @param {React.ReactElement} props.children - Button content.
 * @param {'primary' | 'secondary'} [props.variant] - Button style variant.
 * @param {boolean} [props.disabled] - Whether the button is disabled.
 * @param {'submit' | 'button'} [props.type] - Button type.
 * @param {string} [props.form] - Form ID to associate with.
 * @param {() => void} [props.onClick] - Click handler.
 * @param props.className
 * @returns {React.ReactElement} The Button component.
 */
export default function Button ({ children, variant = 'primary', disabled, type = 'button', form, onClick, className = '' }) {
  const base = 'w-full py-2.5 px-4 rounded-md cursor-pointer text-sm font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
  const variants = {
    primary: 'bg-brand hover:bg-red-700 text-white',
    secondary: 'bg-surface hover:bg-surface-light text-text'
  }

  return (
    <button
      type={type}
      form={form}
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  )
}
