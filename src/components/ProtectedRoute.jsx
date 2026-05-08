import { useAuth } from '../hooks/useAuth.js'
import { Navigate } from 'react-router-dom'

/**
 * Route guard that redirects unauthenticated users to the discovery page.
 * Waits for the auth state to resolve before rendering or redirecting.
 * @param {object} props - Component props.
 * @param {React.ReactElement} props.children - The protected page content.
 * @returns {React.ReactElement} The children, a loading indicator, or a redirect.
 */
export default function ProtectedRoute ({ children }) {
  const { user, loading } = useAuth()

  if (loading) return <p className='size-full flex justify-center mt-[25%] text-base font-normal text-gray-400'>Loading...</p>
  if (!user) return <Navigate to='/' />

  return children
}
