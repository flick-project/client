import { X } from 'lucide-react'

/**
 * Authentication modal for user login and registration.
 * @param {object} props - Component props.
 * @param {() => void} props.onClose - Callback to close the modal.
 * @returns {React.ReactElement} The AuthModal component.
 */
function AuthModal ({ onClose }) {
  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black/50 z-50' onClick={onClose}>
      <div className='flex flex-col gap-6 bg-surface-light rounded-lg p-6 w-96' onClick={(e) => e.stopPropagation()}>
        <div className='flex flex-col gap-2'>
          <div className='flex justify-end'>
            <button onClick={onClose} className='p-2 bg-surface rounded-full cursor-pointer'>
              <X size={20} />
            </button>
          </div>
          <h2 className='text-xl font-bold text-center'>Log in to Flick</h2>
        </div>

        <div className='flex flex-col gap-6'>
          <form
            id='auth-form' className='flex flex-col gap-4' onSubmit={(e) => {
              // Prevent default page reload.
              e.preventDefault()
            }}
          >
            <input
              type='email'
              placeholder='Email'
              className='p-2 rounded bg-surface outline-none focus:outline-solid focus:outline-1 focus:outline-slate-700'
            />
            <input
              type='password'
              placeholder='Password'
              className='p-2 rounded bg-surface outline-none focus:outline-solid focus:outline-1 focus:outline-slate-700'
            />
          </form>

          <button
            type='button' form='auth-form'
            className='p-2 rounded-full bg-brand hover:bg-red-700 text-white cursor-pointer'
          >
            Log in
          </button>
        </div>

        <hr className='border-slate-700' />

        <p className='text-sm text-slate-400 text-center'>
          Don't have an account? <button className='text-brand hover:underline'>Sign up</button>
        </p>
      </div>
    </div>
  )
}

export default AuthModal
