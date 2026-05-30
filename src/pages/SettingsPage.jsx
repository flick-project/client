import { useState } from 'react'
import { usePageMetadata } from '../hooks/usePageMetadata.js'
import { useAuth } from '../hooks/useAuth.js'
import { useToast } from '../hooks/useToast.js'
import { apiRequest } from '../services/api.js'
import { Link, useNavigate } from 'react-router-dom'
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
                    className={`pb-2 text-sm font-medium ${tab === 'account' ? 'border-b-2 border-white text-white' : 'text-gray-400 hover:text-gray-200'} cursor-pointer`}
                  >
                    Account
                  </button>
                </li>
              </ul>
            </nav>
            <hr className='border-white/10' />
          </div>
        </div>

        <div className='flex flex-col gap-8 px-4'>

          <div className='flex flex-col gap-2'>
            <h3 className='text-lg font-bold'>Log out</h3>
            <p className='text-sm text-gray-400 mt-1'>
              Sign out of your account on this device.
            </p>
            <Button onClick={handleLogout} variant='secondary' className='mt-2 w-full h-11 lg:w-44 self-start text-sm'>
              Log out
            </Button>
          </div>

          <div className='flex flex-col gap-2'>
            <h3 className='text-lg font-bold'>Delete account</h3>
            <p className='text-sm text-gray-400'>Permanently delete your account and all associated data. This action cannot be undone.</p>
            <Button onClick={() => setShowConfirm(true)} variant='danger' className='mt-2 h-11 w-full lg:w-44 self-start text-sm'>
              Delete account
            </Button>
          </div>
          {showConfirm && (
            <Modal onClose={() => setShowConfirm(false)}>
              <form onSubmit={(e) => { e.preventDefault(); handleDelete() }} className='flex flex-col gap-8'>
                <div className='flex flex-col gap-2'>
                  <h2 className='text-xl font-bold'>Delete account</h2>
                  <p className='text-sm text-gray-400'>This will permanently delete your account, watchlist, ratings, favorites, and all associated data. This cannot be undone.</p>
                </div>
                <div className='flex flex-col gap-4'>
                  <div className='flex flex-col gap-2'>
                    <label className='text-sm text-gray-400'>Type <span className='text-white font-medium'>delete my account</span> to confirm</label>
                    <Input
                      type='text' required disabled={isLoading} value={confirmText}
                      onChange={(e) => setConfirmText(e.target.value)}
                    />
                  </div>
                  <Button type='submit' disabled={isLoading || confirmText !== 'delete my account'}>
                    {isLoading ? 'Deleting...' : 'Delete account'}
                  </Button>
                </div>
              </form>
            </Modal>
          )}
        </div>
      </div>
    </div>
  )
}
