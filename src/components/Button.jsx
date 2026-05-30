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
 * @param {boolean} [props.full] - Whether the button should be full width.
 * @returns {React.ReactElement} The Button component.
 */
export default function Button ({ children, variant = 'primary', disabled, type = 'button', form, onClick, className = '', full }) {
  const base = 'py-2 px-4 rounded-md cursor-pointer text-base font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
  const variants = {
    primary: `${full ? 'w-full' : ''} border border-transparent bg-brand hover:enabled:bg-red-700 text-white`,
    secondary: 'border border-gray-500 text-gray-400 hover:bg-white/10',
    danger: 'border border-red-400 text-red-400 hover:bg-red-400/10'
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
