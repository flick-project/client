import IconButton from './IconButton.jsx'
import { RotateCcw, X, Bookmark, Star } from 'lucide-react'

/**
 * Navigation controls for the discovery flow.
 * @param {object} props - Component props.
 * @param {function(string): Promise<void>} props.interaction - Handler for movie interactions.
 * @param {function(): void} props.handleBack - Handler to return to the previous movie.
 * @param {boolean} props.canGoBack - Whether the back button is enabled.
 * @returns {React.ReactElement} The DiscoveryControls component.
 */
export default function DiscoveryControls ({ interaction, handleBack, canGoBack }) {
  return (
    <div className='flex items-center justify-center gap-6'>
      <IconButton
        onClick={handleBack} disabled={!canGoBack} icon={RotateCcw}
        backgroundColor='bg-yellow-500/10' textColor='text-yellow-400'
        strokeWidth={2} size='small' animation='scale' ariaLabel='Go back' title='Go back'
      />

      <IconButton
        onClick={() => interaction('skipped')} icon={X}
        backgroundColor='bg-red-500/10' textColor='text-red-400'
        strokeWidth={2} animation='scale' ariaLabel='Skip' title='Skip'
      />

      <IconButton
        onClick={() => interaction('saved')} icon={Bookmark}
        backgroundColor='bg-emerald-500/10' textColor='text-emerald-400'
        filled animation='scale' ariaLabel='Save' title='Save'
      />

      <IconButton
        onClick={() => interaction('rate')} icon={Star}
        backgroundColor='bg-blue-500/10' textColor='text-blue-400'
        filled size='small' animation='scale' ariaLabel='Rate' title='Rate'
      />
    </div>
  )
}
