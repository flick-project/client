import { useCallback } from 'react'
import { Film, Search } from 'lucide-react'
import { useDiscoveryQueue } from '../hooks/useDiscoveryQueue.js'
import SearchHeader from './SearchHeader.jsx'

/**
 * Discovery header area that toggles between logo and search.
 * @param {object} props - Component props.
 * @param {(movie: object|null) => void} props.onSelect - Callback when a movie is selected or search is closed.
 * @returns {React.ReactElement} The DiscoveryHeader component.
 */
export default function DiscoveryHeader ({ onSelect }) {
  const { searchOpen, openSearch } = useDiscoveryQueue()

  const closeSearch = useCallback(() => {
    onSelect(null)
  }, [onSelect])

  if (searchOpen) {
    return <SearchHeader onSelect={onSelect} onClose={closeSearch} />
  }

  return (
    <div className='flex items-center justify-between h-6'>
      <div className='flex items-center gap-2'>
        <Film size={28} className='text-brand rotate-90' />
        <h1 className='text-xl font-semibold'>Flick</h1>
      </div>
      <button onClick={openSearch} className='cursor-pointer'>
        <Search size={24} className='text-text-muted' />
      </button>
    </div>
  )
}
