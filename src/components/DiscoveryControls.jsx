import IconButton from './IconButton.jsx'
import { RotateCcw, X, Bookmark } from 'lucide-react'

/**
 * Navigation controls for the discovery flow (back, skip, save).
 * @param {object} props - Component props.
 * @param {function(string): Promise<void>} props.interaction - Handler for movie interactions.
 * @param {function(): void} props.handleBack - Handler to return to the previous movie.
 * @param {boolean} props.canGoBack - Whether the back button is enabled.
 * @returns {React.ReactElement} The DiscoveryControls component.
 */
export default function DiscoveryControls ({ interaction, handleBack, canGoBack }) {
  return (
    <div className='flex gap-8'>
      <IconButton onClick={handleBack} disabled={!canGoBack} icon={RotateCcw} backgroundColor='bg-neutral-500/15' borderColor='border-neutral-500/40' textColor='text-neutral-400' />
      <IconButton onClick={() => interaction('skipped')} icon={X} backgroundColor='bg-red-500/15' borderColor='border-red-400/30' textColor='text-red-400' />
      <IconButton onClick={() => interaction('saved')} icon={Bookmark} backgroundColor='bg-yellow-500/15' borderColor='border-yellow-400/30' textColor='text-yellow-400' animation='fill' />
    </div>
  )
}
