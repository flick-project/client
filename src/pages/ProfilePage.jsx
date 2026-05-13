import { apiRequest } from '../services/api.js'
import { useState, useEffect } from 'react'
import { CircleUser } from 'lucide-react'

/**
 * Profile page displaying user information and activity.
 * @returns {React.ReactElement} The ProfilePage component.
 */
export default function ProfilePage () {
  const [profile, setProfile] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true)
      try {
        const result = await apiRequest('/user/profile')
        setProfile(result)
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })

  if (isLoading || !profile) return <p>Loading</p>
  return (
    <div className='flex flex-col gap-6 p-6 max-w-5xl w-full'>
      <div className='flex gap-4 w-full'>
        {profile.gravatar
          ? <img src={profile.gravatar} alt='Avatar' className='rounded-full w-32 h-32' />
          : <CircleUser size={128} strokeWidth={1.25} />}
        <div className='flex flex-col justify-center gap-4'>
          <p className='text-xl font-semibold leading-none'>{profile.displayName}</p>
          <p className='text-sm font-medium leading-none text-gray-400'>Member since {formatDate(profile.createdAt)}</p>
        </div>
      </div>
      <hr className='border-white/10' />
    </div>
  )
}
