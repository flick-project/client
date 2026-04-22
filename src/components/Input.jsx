/**
 * Reusable input field.
 * @param {object} props - Component props.
 * @param {string} props.type - Input type.
 * @param {string} props.placeholder - Placeholder text.
 * @param {string} props.value - Input value.
 * @param {(e: Event) => void} props.onChange - Change handler.
 * @param {boolean} [props.required] - Whether the field is required.
 * @param {boolean} [props.disabled] - Whether the field is disabled.
 * @returns {React.ReactElement} The Input component.
 */
export default function Input ({ type, placeholder, value, onChange, required, disabled }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled}
      className='p-2 rounded-md bg-surface outline-none focus:outline-solid focus:outline-1 focus:outline-slate-700 disabled:opacity-50'
    />
  )
}
