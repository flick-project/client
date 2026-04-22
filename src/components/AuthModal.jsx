import { X } from 'lucide-react'
import { useState } from 'react'
import { useToast } from '../hooks/useToast'
import Input from '../components/Input.jsx'
import Button from '../components/Button.jsx'

/**
 * Authentication modal for user login and registration.
 * @param {object} props - Component props.
 * @param {() => void} props.onClose - Callback to close the modal.
 * @returns {React.ReactElement} The AuthModal component.
 */
export default function AuthModal ({ onClose }) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const { showToast } = useToast()

  /**
   * Reset form fields and errors when switching between login and register.
   * @param {boolean} toLogin - Whether to switch to login mode.
   */
  const switchMode = (toLogin) => {
    setIsLogin(toLogin)
    setEmail('')
    setPassword('')
    setErrors({})
  }

  /**
   * Handle form submission for login or registration.
   * @param {Event} e - The form submit event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})

    // Only validate password length on registration.
    if (!isLogin && password.length < 10) {
      setErrors({ password: 'Password must be at least 10 characters' })
      return
    }

    setIsLoading(true)
    const endpoint = isLogin ? '/login' : '/register'

    try {
      const res = await fetch(`http://localhost:3000/api/v1/auth${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()

      if (!res.ok) {
        setErrors({ general: data.message })
        return
      }

      if (!isLogin) {
        showToast('Registration successful!', 'success')
        onClose()
      }
    } catch (err) {
      console.error(err)
      setErrors({ general: 'Something went wrong. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    // Backdrop. Closes modal on click.
    <div className='fixed inset-0 flex items-center justify-center bg-black/50 z-50' onClick={onClose}>
      {/* Modal content. Stops click from reaching backdrop. */}
      <div className='flex flex-col gap-6 bg-surface-light rounded-lg p-6 w-96' onClick={(e) => e.stopPropagation()}>
        <div className='flex flex-col gap-2'>
          <div className='flex justify-end'>
            <button onClick={onClose} className='p-2 bg-surface rounded-full cursor-pointer'>
              <X size={20} />
            </button>
          </div>
          <h2 className='text-xl font-bold text-center'>
            {isLogin ? 'Log in to Flick' : 'Sign up for Flick'}
          </h2>
        </div>

        {errors.general && <p className='text-red-500 text-sm text-center'>{errors.general}</p>}

        <div className='flex flex-col gap-6'>
          <form id='auth-form' className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <Input
              type='email'
              required
              disabled={isLoading}
              placeholder='Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type='password'
              required
              disabled={isLoading}
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && <p className='text-red-500 text-sm text-center'>{errors.password}</p>}
          </form>
          <Button type='submit' form='auth-form' disabled={isLoading}>
            {isLoading ? 'Processing...' : (isLogin ? 'Log in' : 'Sign up')}
          </Button>
        </div>

        <hr className='border-slate-700' />

        {/* Toggle between login and registration. */}
        <p className='text-sm text-slate-400 text-center'>
          {isLogin
            ? <>Don't have an account? <button className='text-brand hover:underline cursor-pointer' onClick={() => switchMode(false)}>Sign up</button></>
            : <>Already have an account? <button className='text-brand hover:underline cursor-pointer' onClick={() => switchMode(true)}>Log in</button></>}
        </p>
      </div>
    </div>
  )
}
