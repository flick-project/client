import { useState, useRef } from 'react'
import { Turnstile } from '@marsidev/react-turnstile'
import { useAuth } from '../hooks/useAuth.js'
import { apiRequest } from '../services/api.js'
import Input from '../components/Input.jsx'
import Button from '../components/Button.jsx'
import { EyeOff, Eye } from 'lucide-react'

/**
 * Authentication modal for user login and registration.
 * @param {object} props - Component props.
 * @param {(message: string) => void} props.onLoginSuccess - Callback with a welcome message after login.
 * @param {() => void} props.onRegisterSuccess - Callback after successful registration.
 * @returns {React.ReactElement} The AuthModal component.
 */
export default function AuthModal ({ onLoginSuccess, onRegisterSuccess }) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState(null)
  const turnstileRef = useRef(null)
  const { login } = useAuth()

  /**
   * Validate registration fields and return all errors at once.
   * @returns {object} Validation errors.
   */
  const validateRegistration = () => {
    const newErrors = {}

    if (displayName.length < 3) {
      newErrors.displayName = 'Nickname must be at least 3 characters'
    }
    if (password.length < 10) {
      newErrors.password = 'Password must be at least 10 characters'
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    return newErrors
  }

  /**
   * Reset form fields, errors, and Turnstile widget when switching modes.
   * @param {boolean} toLogin - Whether to switch to login mode.
   */
  const switchMode = (toLogin) => {
    setIsLogin(toLogin)
    setEmail('')
    setDisplayName('')
    setPassword('')
    setConfirmPassword('')
    setShowPassword(false)
    setErrors({})
    setTurnstileToken(null)
    turnstileRef.current?.reset()
  }

  /**
   * Handle form submission for login or registration.
   * @param {Event} e - The form submit event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})

    if (!isLogin) {
      const validationErrors = validateRegistration()
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors)
        return
      }
    }

    if (!turnstileToken) {
      setErrors({ general: 'Please complete the verification.' })
      return
    }

    setIsLoading(true)

    const endpoint = isLogin ? '/login' : '/register'

    try {
      const body = isLogin
        ? { email, password, turnstileToken }
        : { email, password, displayName, turnstileToken }

      const data = await apiRequest(`/auth${endpoint}`, {
        method: 'POST',
        body: JSON.stringify(body)
      })

      const userData = login(data)
      if (isLogin) {
        onLoginSuccess(`Welcome back ${userData.displayName}`)
      } else {
        onRegisterSuccess()
      }
    } catch (err) {
      console.error(err)
      turnstileRef.current?.reset()
      setTurnstileToken(null)
      setErrors({ general: err.message || 'Something went wrong. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='flex flex-col gap-6'>
      <h2 className='text-xl font-bold text-center'>
        {isLogin ? 'Log in to Flick' : 'Sign up for Flick'}
      </h2>

      {errors.general && <p className='text-red-500 text-sm text-center'>{errors.general}</p>}

      <div className='flex flex-col gap-4'>
        <form id='auth-form' className='flex flex-col gap-4' onSubmit={handleSubmit}>
          <Input
            type='email' required disabled={isLoading} placeholder='Email' value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {!isLogin &&
            <Input
              type='text' required disabled={isLoading} placeholder='Nickname' value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />}
          {errors.displayName && <p className='text-red-500 text-sm text-center'>{errors.displayName}</p>}
          <Input
            type={showPassword ? 'text' : 'password'}
            required
            disabled={isLoading}
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={
              <button type='button' onClick={() => setShowPassword(!showPassword)} className='cursor-pointer p-2 -m-2'>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
            className='[&::-ms-reveal]:hidden [&::-webkit-credentials-auto-fill-button]:hidden'
          />
          {errors.password && <p className='text-red-500 text-sm text-center'>{errors.password}</p>}
          {!isLogin && (
            <Input
              type={showPassword ? 'text' : 'password'}
              required
              disabled={isLoading}
              placeholder='Confirm password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          )}
          {errors.confirmPassword && <p className='text-red-500 text-sm text-center'>{errors.confirmPassword}</p>}

          <div className='flex justify-center'>
            <Turnstile
              ref={turnstileRef}
              siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
              onSuccess={setTurnstileToken}
              onExpire={() => setTurnstileToken(null)}
              onError={() => setTurnstileToken(null)}
              options={{ theme: 'dark' }}
            />
          </div>
        </form>
        <Button type='submit' form='auth-form' disabled={isLoading || !turnstileToken}>
          {isLogin ? 'Log in' : 'Sign up'}
        </Button>
      </div>

      <div className='flex flex-col gap-6'>
        <hr className='border-white/10' />

        {/* Toggle between login and registration. */}
        <p className='text-sm text-center text-muted-foreground'>
          {isLogin
            ? <>Don't have an account? <button className='text-primary hover:underline cursor-pointer' onClick={() => switchMode(false)}>Sign up</button></>
            : <>Already have an account? <button className='text-primary hover:underline cursor-pointer' onClick={() => switchMode(true)}>Log in</button></>}
        </p>
      </div>
    </div>
  )
}
