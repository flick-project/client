/**
 * Reusable button component.
 * @param {object} props - Component props.
 * @param {React.ReactElement} props.children - Button content.
 * @param {'primary' | 'secondary'} [props.variant] - Button style variant.
 * @param {boolean} [props.disabled] - Whether the button is disabled.
 * @param {'submit' | 'button'} [props.type] - Button type.
 * @param {string} [props.form] - Form ID to associate with.
 * @param {() => void} [props.onClick] - Click handler.
 * @param {string} [props.className] - Additional CSS classes.
 * @returns {React.ReactElement} The Button component.
 */
export default function Button ({ children, variant = 'primary', disabled, type = 'button', form, onClick, className = '' }) {
  const base = 'w-full py-3 px-4 rounded-md cursor-pointer text-sm font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed leading-none'
  const variants = {
    primary: 'border border-transparent bg-brand hover:enabled:bg-red-700 text-white',
    secondary: 'border border-gray-500 text-gray-400'
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
