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
      <IconButton onClick={handleBack} disabled={!canGoBack} icon={RotateCcw} backgroundColor='bg-neutral-400/10' borderColor='border-neutral-400/25' textColor='text-neutral-400' />
      <IconButton onClick={() => interaction('skipped')} icon={X} backgroundColor='bg-red-500/10' borderColor='border-red-500/25' textColor='text-red-500' />
      <IconButton onClick={() => interaction('saved')} icon={Bookmark} backgroundColor='bg-yellow-500/10' borderColor='border-yellow-500/25' textColor='text-yellow-500' animation='fill' />
    </div>
  )
}
