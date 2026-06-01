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
      await apiRequest('/user', { method: 'DELETE' })
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
            <nav>
              <ul className='flex items-start gap-6 px-4'>
                <li>
                  <button
                    onClick={() => setTab('account')}
                    className={`pb-2 text-sm font-medium ${tab === 'account' ? 'border-b-2 border-white text-white' : 'text-gray-300 hover:text-gray-200'} cursor-pointer`}
                  >
                    Account
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setTab('about')}
                    className={`pb-2 text-sm font-medium ${tab === 'about' ? 'border-b-2 border-white text-white' : 'text-gray-300 hover:text-gray-200'} cursor-pointer`}
                  >
                    About
                  </button>
                </li>
              </ul>
            </nav>
            <hr className='border-white/10' />
          </div>
        </div>

        {tab === 'account' && (
          <div className='flex flex-col gap-8 px-4'>

            <div className='flex flex-col gap-2'>
              <h3 className='text-lg font-bold'>Log out</h3>
              <p className='text-sm text-gray-300'>
                Sign out of your account on this device.
              </p>
              <Button onClick={handleLogout} variant='secondary' size='lg' full className='mt-2 lg:w-44 self-start'>
                Log out
              </Button>
            </div>

            <div className='flex flex-col gap-2'>
              <h3 className='text-lg font-bold'>Delete account</h3>
              <p className='text-sm text-gray-300'>Permanently delete your account and all associated data. This action cannot be undone.</p>
              <Button onClick={() => setShowConfirm(true)} variant='danger' size='lg' full className='mt-2 lg:w-44 self-start'>
                Delete account
              </Button>
            </div>
            {showConfirm && (
              <Modal onClose={() => setShowConfirm(false)}>
                <form onSubmit={(e) => { e.preventDefault(); handleDelete() }} className='flex flex-col gap-8'>
                  <div className='flex flex-col gap-2'>
                    <h2 className='text-xl font-bold'>Delete account</h2>
                    <p className='text-sm text-gray-300'>This will permanently delete your account, watchlist, ratings, favorites, and all associated data. This cannot be undone.</p>
                  </div>
                  <div className='flex flex-col gap-4'>
                    <div className='flex flex-col gap-2'>
                      <label className='text-sm text-gray-300'>Type <span className='text-white font-medium'>delete my account</span> to confirm</label>
                      <Input
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
          <div className='flex flex-col gap-6 px-4'>
            <div className='flex flex-col rounded-lg border border-white/10 divide-y divide-white/10'>
              <a
                href='https://www.themoviedb.org'
                target='_blank'
                rel='noreferrer'
                className='flex items-center justify-between px-4 py-3 text-sm hover:bg-white/5 transition-colors'
              >
                <span>Data provided by TMDB</span>
                <ExternalLink size={14} className='text-gray-400' />
              </a>
              <Link
                to='/privacy'
                className='flex items-center justify-between px-4 py-3 text-sm hover:bg-white/5 transition-colors'
              >
                <span>Privacy Policy</span>
                <ChevronRight size={14} className='text-gray-400' />
              </Link>
            </div>

            <p className='text-xs text-gray-400 px-1'>Flick v{import.meta.env.VITE_APP_VERSION}</p>
          </div>
        )}
      </div>
    </div>
  )
}
