import Navigation from './Navigation.jsx'
import BottomNav from './BottomNav.jsx'

/**
 * App shell layout using CSS grid to manage sidebar, content, and bottom nav.
 * Provides a definite height chain from the viewport root so pages can
 * reliably fill available space.
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.header - Optional mobile-only header (e.g. Discovery logo).
 * @param {boolean} [props.centered] - Reserves space on the right equal to the sidebar so content is viewport-centered instead of remaining-space-centered.
 * @param {React.ReactNode} props.children - Page content.
 * @returns {React.ReactElement} The AppLayout component.
 */
export default function AppLayout ({ header, centered = false, children }) {
  const cols = centered
    ? 'lg:grid-cols-[16rem_1fr_16rem]'
    : 'lg:grid-cols-[16rem_1fr]'

  return (
    <div className={`h-dvh grid lg:grid-rows-[minmax(0,1fr)] ${cols} overflow-hidden ${header ? 'grid-rows-[auto_minmax(0,1fr)_auto]' : 'grid-rows-[minmax(0,1fr)_auto]'}`}>
      <aside className='hidden lg:flex lg:row-start-1 lg:col-start-1 min-h-0'>
        <Navigation />
      </aside>

      {header && (
        <header className='lg:hidden'>
          {header}
        </header>
      )}

      <main className='min-h-0 overflow-y-auto flex justify-center lg:row-start-1 lg:col-start-2'>
        {children}
      </main>

      <BottomNav />
    </div>
  )
}
