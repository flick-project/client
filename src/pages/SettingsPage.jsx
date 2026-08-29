import { useState } from 'react'
import { usePageMetadata } from '../hooks/usePageMetadata.js'
import { useAuth } from '../hooks/useAuth.js'
import { useToast } from '../hooks/useToast.js'
import { apiRequest } from '../services/api.js'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronRight, ExternalLink } from 'lucide-react'
import PageHeader from '../components/PageHeader.jsx'
import Modal from '../components/Modal.jsx'
import Input from '../components/Input.jsx'
import Button from '../components/Button.jsx'
import ImportPanel from '../components/ImportPanel.jsx'

/**
 * Settings page.
 * @returns {React.ReactElement} The SettingsPage component.
 */
export default function SettingsPage () {
  const { logout } = useAuth()
  const { showToast } = useToast()
  const [tab, setTab] = useState('account')
  const [showConfirm, setShowConfirm] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  usePageMetadata('Settings')

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      await apiRequest('/user/account', { method: 'DELETE' })
      logout()
    } catch (err) {
      setIsLoading(false)
      console.error(err)
      showToast('Something went wrong. Please try again.', 'error')
    }
  }

  const handleLogout = () => {
    logout()
    showToast('Logged out successfully!', 'success')
    navigate('/')
  }

  return (
    <div className='w-full max-w-4xl md:py-8'>
      <PageHeader
        back
        title='Settings'
      />
      <div className='w-full flex flex-col gap-6'>
        <div className='flex flex-col gap-6'>
          <h2 className='hidden md:block text-2xl font-medium px-4'>Settings</h2>
          <div>
            <nav aria-label='Settings tabs'>
              <ul className='flex items-start gap-6 px-4' role='tablist'>
                <li role='presentation'>
                  <button
                    onClick={() => setTab('account')}
                    role='tab'
                    aria-selected={tab === 'account'}
                    aria-controls='panel-account'
                    className={`pb-2 text-md font-medium min-h-11 ${tab === 'account' ? 'border-b-2 border-white text-foreground' : 'text-gray-300 hover:text-gray-200'} cursor-pointer`}
                  >
                    Account
                  </button>
                </li>
                <li role='presentation'>
                  <button
                    onClick={() => setTab('about')}
                    role='tab'
                    aria-selected={tab === 'about'}
                    aria-controls='panel-about'
                    className={`pb-2 text-md font-medium min-h-11 ${tab === 'about' ? 'border-b-2 border-white text-foreground' : 'text-gray-300 hover:text-gray-200'} cursor-pointer`}
                  >
                    About
                  </button>
                </li>
              </ul>
            </nav>
            <hr className='border-white/15' aria-hidden='true' />
          </div>
        </div>

        {tab === 'account' && (
          <div id='panel-account' role='tabpanel' aria-labelledby='tab-account' className='flex flex-col gap-8 px-4'>

            <section className='flex flex-col gap-2'>
              <h3 className='text-lg font-bold'>Import ratings</h3>
              <p className='text-sm text-gray-300'>
                Import ratings from TMDB, IMDB or Letterboxd to shape your recommendations faster.
              </p>
              <div className='mt-2'>
                <ImportPanel />
              </div>
            </section>

            <section className='flex flex-col gap-2'>
              <h3 className='text-lg font-bold'>Log out</h3>
              <p className='text-sm text-gray-300'>
                Sign out of your account on this device.
              </p>
              <Button onClick={handleLogout} variant='secondary' size='lg' full className='mt-2 lg:w-44 self-start'>
                Log out
              </Button>
            </section>

            <section className='flex flex-col gap-2'>
              <h3 className='text-lg font-bold'>Delete account</h3>
              <p className='text-sm text-gray-300'>Permanently delete your account and all associated data. This action cannot be undone.</p>
              <Button onClick={() => setShowConfirm(true)} variant='danger' size='lg' full className='mt-2 lg:w-44 self-start'>
                Delete account
              </Button>
            </section>
            {showConfirm && (
              <Modal onClose={() => setShowConfirm(false)}>
                <form onSubmit={(e) => { e.preventDefault(); handleDelete() }} className='flex flex-col gap-8'>
                  <div className='flex flex-col gap-2'>
                    <h2 className='text-xl font-bold'>Delete account</h2>
                    <p className='text-sm text-gray-300'>This will permanently delete your account, watchlist, ratings, favorites, and all associated data. This cannot be undone.</p>
                  </div>
                  <div className='flex flex-col gap-4'>
                    <div className='flex flex-col gap-2'>
                      <label htmlFor='confirm-delete' className='text-sm text-gray-300'>Type <span className='text-foreground font-medium'>delete my account</span> to confirm</label>
                      <Input
                        id='confirm-delete'
                        type='text' required disabled={isLoading} value={confirmText}
                        onChange={(e) => setConfirmText(e.target.value)}
                      />
                    </div>
                    <Button type='submit' loading={isLoading} disabled={confirmText !== 'delete my account'}>
                      Delete account
                    </Button>
                  </div>
                </form>
              </Modal>
            )}
          </div>
        )}

        {tab === 'about' && (
          <div id='panel-about' role='tabpanel' aria-labelledby='tab-about' className='flex flex-col gap-6 px-4'>
            <div className='flex flex-col rounded-lg border border-white/15 divide-y divide-white/15 overflow-hidden'>
              <a
                href='https://www.themoviedb.org'
                target='_blank'
                rel='noreferrer'
                className='flex items-center justify-between px-4 min-h-11 hover:bg-white/5 transition-colors'
              >
                <span className='text-sm'>Data provided by TMDB</span>
                <ExternalLink size={16} className='text-muted-foreground' aria-hidden='true' />
              </a>
              <Link
                to='/privacy'
                className='flex items-center justify-between px-4 min-h-11 hover:bg-white/5 transition-colors'
              >
                <span className='text-sm'>Privacy Policy</span>
                <ChevronRight size={16} className='text-muted-foreground' aria-hidden='true' />
              </Link>
            </div>

            <p className='text-xs text-muted-foreground px-1'>Flick v{import.meta.env.VITE_APP_VERSION}</p>
          </div>
        )}
      </div>
    </div>
  )
}
