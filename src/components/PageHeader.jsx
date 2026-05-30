/**
 * Mobile header with optional back navigation and right action.
 * @param {object} props - Component props.
 * @param {React.ReactNode} [props.action] - Optional right-side element.
 * @returns {React.ReactElement} The TopBar component.
 */

import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'

/**
 * Mobile page header with back navigation, title, and optional action.
 * @param {object} props - Component props.
 * @param {boolean} props.back - Whether the back icon should appear.
 * @param {string} [props.title] - Centered page title.
 * @param {React.ReactNode} [props.action] - Optional right-side element.
 * @returns {React.ReactElement} The PageHeader component.
 */
export default function PageHeader ({ back, action, title }) {
  const navigate = useNavigate()

  return (
    <div className='md:hidden grid grid-cols-3 items-center p-4 mb-4'>
      {/* Left */}
      {back
        ? <button onClick={() => navigate(-1)} className='justify-self-start hover:text-gray-200'><ChevronLeft size={24} /></button>
        : <span />}

      {/* Center */}
      <h1 className='justify-self-center text-base font-semibold'>
        {title}
      </h1>

      {/* Right */}
      <div className='justify-self-end'>
        {action}
      </div>
    </div>
  )
}
