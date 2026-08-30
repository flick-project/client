import { Film, Search } from 'lucide-react'
import { useSearch } from '../hooks/useSearch.js'
import SearchHeader from './SearchHeader.jsx'

/**
 * Discovery header area that toggles between logo and search.
 * @returns {React.ReactElement} The DiscoveryHeader component.
 */
export default function DiscoveryHeader () {
  const { searchOpen, openSearch, closeSearch } = useSearch()

  if (searchOpen) {
    return <SearchHeader onClose={closeSearch} />
  }

  return (
    <div className='w-full flex items-center justify-between size-14 px-4 border-b border-white/10 bg-surface z-20'>
      <div className='flex items-center gap-2'>
        <Film size={28} className='text-primary rotate-90' />
        <h1 className='text-xl font-semibold text-foreground'>Flick</h1>
      </div>
      <button
        onClick={openSearch}
        aria-label='Search movies'
        className='flex items-center justify-center size-11 -mr-2 cursor-pointer'
      >
        <Search size={24} strokeWidth={2} className='text-muted-foreground' />
      </button>
    </div>
  )
}
