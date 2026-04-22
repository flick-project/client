import { X } from 'lucide-react'
import { useState } from 'react'

/**
 * Authentication modal for user login and registration.
 * @param {object} props - Component props.
 * @param {() => void} props.onClose - Callback to close the modal.
 * @returns {React.ReactElement} The AuthModal component.
 */
function AuthModal ({ onClose }) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage(null)
    setError(null)

    const endpoint = isLogin ? '/login' : '/register'

    try {
      const res = await fetch(`http://localhost:3000/api/v1/auth${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message)
        return
      }

      setMessage(data.message)
    } catch (err) {
      console.error(err)
      setError('Something went wrong. Please try again.')
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
            {isLogin ? 'Log in to Flick' : 'Create an account'}
          </h2>
        </div>

        {error && <p className='text-red-500 text-sm text-center'>{error}</p>}
        {message && <p className='text-green-500 text-sm text-center'>{message}</p>}

        <div className='flex flex-col gap-6'>
          <form id='auth-form' className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <input
              type='email'
              placeholder='Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='p-2 rounded bg-surface outline-none focus:outline-solid focus:outline-1 focus:outline-slate-700'
            />
            <input
              type='password'
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='p-2 rounded bg-surface outline-none focus:outline-solid focus:outline-1 focus:outline-slate-700'
            />
          </form>

          <button
            type='submit' form='auth-form'
            className='p-2 rounded-full bg-brand hover:bg-red-700 text-white cursor-pointer'
          >
            {isLogin ? 'Log in' : 'Sign up'}
          </button>
        </div>

        <hr className='border-slate-700' />

        <p className='text-sm text-slate-400 text-center'>
          {isLogin
            ? <>Don't have an account? <button className='text-brand hover:underline cursor-pointer' onClick={() => setIsLogin(false)}>Sign up</button></>
            : <>Already have an account? <button className='text-brand hover:underline cursor-pointer' onClick={() => setIsLogin(true)}>Log in</button></>}
        </p>
      </div>
    </div>
  )
}

export default AuthModal
