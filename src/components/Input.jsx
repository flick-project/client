/**
 * Reusable input field.
 * @param {object} props - Component props.
 * @param {string} props.type - Input type.
 * @param {string} props.placeholder - Placeholder text.
 * @param {string} props.value - Input value.
 * @param {(e: Event) => void} props.onChange - Change handler.
 * @param {boolean} [props.required] - Whether the field is required.
 * @param {boolean} [props.disabled] - Whether the field is disabled.
 * @param {React.ComponentType} props.icon - Lucide icon component.
 * @returns {React.ReactElement} The Input component.
 */
export default function Input ({ type, placeholder, value, onChange, required, disabled, icon }) {
  return (
    <div className='relative'>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`w-full text-sm px-3 py-2 ${icon ? 'pr-9' : ''} rounded-md bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-surface focus:ring-white/20 focus:border-white/30 disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-150`}
      />
      {icon && <div className='absolute right-3 top-1/2 -translate-y-1/2 flex items-center text-gray-400'>{icon}</div>}
    </div>
  )
}
