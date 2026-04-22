import { X } from 'lucide-react'
import { useState } from 'react'
import { useToast } from '../hooks/useToast'

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
  const { showToast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const switchMode = (toLogin) => {
    setIsLogin(toLogin)
    setEmail('')
    setPassword('')
    setErrors({})
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})

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
    <div className='fixed inset-0 flex items-center justify-center bg-black/50 z-50' onClick={onClose}>
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
            <input
              type='email'
              required
              disabled={isLoading}
              placeholder='Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='p-2 rounded bg-surface outline-none focus:outline-solid focus:outline-1 focus:outline-slate-700'
            />
            <input
              type='password'
              required
              disabled={isLoading}
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='p-2 rounded bg-surface outline-none focus:outline-solid focus:outline-1 focus:outline-slate-700'
            />
            {errors.password && <p className='text-red-500 text-sm text-center'>{errors.password}</p>}
          </form>

          <button
            type='submit' form='auth-form'
            disabled={isLoading}
            className='p-2 rounded-full bg-brand hover:bg-red-700 text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {isLoading ? 'Processing...' : (isLogin ? 'Log in' : 'Sign up')}
          </button>
        </div>

        <hr className='border-slate-700' />

        <p className='text-sm text-slate-400 text-center'>
          {isLogin
            ? <>Don't have an account? <button className='text-brand hover:underline cursor-pointer' onClick={() => switchMode(false)}>Sign up</button></>
            : <>Already have an account? <button className='text-brand hover:underline cursor-pointer' onClick={() => switchMode(true)}>Log in</button></>}
        </p>
      </div>
    </div>
  )
}
