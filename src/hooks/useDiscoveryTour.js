import { useCallback } from 'react'
import { hasSeen, markSeen } from '../services/storage.js'
import './useTour.css'

const MOBILE_STEPS = [
  {
    popover: {
      title: 'Welcome to Flick',
      description: 'Movies picked for you. Swipe up and down to browse the queue, left and right to switch between poster and trailer.',
      nextBtnText: 'Got it'
    }
  },
  {
    element: '[aria-label="Save"]',
    popover: {
      side: 'left',
      align: 'center',
      title: 'Save',
      description: 'Add it to your watchlist to watch later.'
    }
  },
  {
    element: '[aria-label="Rate"]',
    popover: {
      side: 'left',
      align: 'center',
      title: 'Rate',
      description: 'Already seen it? Rate it so Flick learns your taste.',
      doneBtnText: 'Start discovering'
    }
  }
]

const DESKTOP_STEPS = [
  {
    popover: {
      title: 'Welcome to Flick',
      description: 'Movies picked for you. Use the buttons on the right or scroll to browse and save.',
      nextBtnText: 'Got it'
    }
  },
  {
    element: '[aria-label="Discovery actions"]',
    popover: {
      side: 'top',
      align: 'center',
      title: 'Save',
      description: 'Save what you want to watch, and rate what you\'ve already seen so Flick learns your taste.'
    }
  },
  {
    element: '[aria-label="More options"]',
    popover: {
      side: 'left',
      align: 'center',
      title: 'More actions',
      description: 'Not interested, mark as watched, or view on TMDB.',
      doneBtnText: 'Start discovering'
    }
  }
]

/**
 * Starts a one-time discovery controls tour for first-time users.
 * Steps differ between mobile (swipe-focused) and desktop
 * (button-focused). Runs once per user; storage flag persists.
 * @returns {{ startTour: () => void }} Tour controls.
 */
export function useDiscoveryTour () {
  const startTour = useCallback(async () => {
    if (hasSeen('discovery_tour_seen')) return

    const { driver } = await import('driver.js')
    await import('driver.js/dist/driver.css')

    const isMobile = window.innerWidth < 1024
    const steps = isMobile ? MOBILE_STEPS : DESKTOP_STEPS

    const driverObj = driver({
      showProgress: true,
      progressText: '{{current}} of {{total}}',
      smoothScroll: true,
      stageRadius: 50,
      popoverClass: 'flick-tour',
      steps,
      onDestroyStarted: () => {
        markSeen('discovery_tour_seen')
        driverObj.destroy()
      }
    })

    driverObj.drive()
  }, [])

  return { startTour }
}
