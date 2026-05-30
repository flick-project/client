import { usePageMetadata } from '../hooks/usePageMetadata.js'

/**
 * Privacy page.
 * @returns {React.ReactElement} The PrivacyPage component.
 */
export default function PrivacyPage () {
  usePageMetadata('Privacy Policy')

  return (
    <div className='size-full overflow-y-auto'>
      <div className='max-w-3xl mx-auto flex flex-col gap-8 p-6 xl:p-8 overflow-hidden'>
        <div className='flex flex-col gap-4'>
          <h2 className='text-3xl font-bold'>Privacy Policy</h2>
          <p className='text-base italic'>Last updated: 2026-05-28</p>
        </div>

        <div className='flex flex-col gap-2'>
          <h3 className='text-lg font-bold'>What is collected and why</h3>
          <p className='text-base leading-relaxed'>Your email and a hashed password are stored to manage your account.
            Movie interactions like saves, skips, ratings, and favorites are stored to power your watchlist and recommendations.
          </p>
        </div>

        <div className='flex flex-col gap-2'>
          <h3 className='text-lg font-bold'>Third-party services</h3>
          <p className='text-base leading-relaxed'>
            Flick fetches movie data and posters from TMDB. No personal data is sent to TMDB.
            When you view your profile, a hashed version of your email is sent to Gravatar to load your avatar.
            Learn more at <a href='https://gravatar.com/support' className='text-red-500'>gravatar.com/support</a>.
          </p>
        </div>

        <div className='flex flex-col gap-2'>
          <h3 className='text-lg font-bold'>Cookies</h3>
          <p className='text-base leading-relaxed'>
            A single httpOnly cookie stores a refresh token to keep you logged in. It expires after 7 days and is not used for tracking.
          </p>
        </div>

        <div className='flex flex-col gap-2'>
          <h3 className='text-lg font-bold'>Data retention</h3>
          <p className='text-base leading-relaxed'>
            Your data exists as long as your account does. Deleting your account permanently removes all associated data.
          </p>
        </div>

        <div className='flex flex-col gap-2'>
          <h3 className='text-lg font-bold'>Your rights</h3>
          <p className='text-base leading-relaxed'>
            You can view your data in the app and permanently delete your account and all data from the profile page.
          </p>
        </div>

        <div className='flex flex-col gap-2'>
          <h3 className='text-lg font-bold'>Contact</h3>
          <p className='text-base leading-relaxed'>
            Questions about your data? Reach me at <a href='mailto:flick@lingon.cloud' className='text-red-500'>flick@lingon.cloud.</a>
          </p>
        </div>
      </div>
    </div>
  )
}
