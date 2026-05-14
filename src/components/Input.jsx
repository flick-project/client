/**
 * Reusable input field.
 * @param {object} props - Component props.
 * @param {string} props.type - Input type.
 * @param {string} props.placeholder - Placeholder text.
 * @param {string} props.value - Input value.
 * @param {(e: Event) => void} props.onChange - Change handler.
 * @param {boolean} [props.required] - Whether the field is required.
 * @param {boolean} [props.disabled] - Whether the field is disabled.
 * @param props.icon
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
        className={`size-full text-base p-2 px-3 ${icon ? 'pr-10' : ''} rounded-lg bg-surface outline-1 outline-white/10 placeholder-gray-400 focus:outline-solid focus:outline-2 focus:outline-white/10 disabled:opacity-50`}
      />
      {icon && <div className='absolute right-3 top-1/2 -translate-y-1/2 flex items-center text-gray-400'>{icon}</div>}
    </div>
  )
}
