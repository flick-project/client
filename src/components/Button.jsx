/**
 * Reusable button component.
 * @param {object} props - Component props.
 * @param {React.ReactElement} props.children - Button content.
 * @param {'primary' | 'secondary'} [props.variant] - Button style variant.
 * @param {boolean} [props.disabled] - Whether the button is disabled.
 * @param {'submit' | 'button'} [props.type] - Button type.
 * @param {string} [props.form] - Form ID to associate with.
 * @param {() => void} [props.onClick] - Click handler.
 * @returns {React.ReactElement} The Button component.
 */
export default function Button ({ children, variant = 'primary', disabled, type = 'button', form, onClick }) {
  const base = 'w-full p-2 rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
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
      className={`${base} ${variants[variant]}`}
    >
      {children}
    </button>
  )
}
