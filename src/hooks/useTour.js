import { useCallback } from 'react'
import { hasSeen, markSeen } from '../services/storage.js'
import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'
import './useTour.css'

/**
 * Starts a one-time discovery controls tour for first-time users.
 * @returns {{ startTour: () => void }} Tour controls.
 */
export function useDiscoveryTour () {
  const startTour = useCallback(() => {
    if (hasSeen('discovery_tour_seen')) return

    const driverObj = driver({
      showProgress: true,
      progressText: '{{current}} of {{total}}',
      smoothScroll: true,
      stageRadius: 50,
      popoverClass: 'flick-tour',
      steps: [
        {
          popover: {
            title: 'Quick controls',
            description: 'Four buttons are all you need to start finding movies.',
            nextBtnText: 'Show me'
          }
        },
        {
          element: '[aria-label="Skip"]',
          popover: {
            side: 'top',
            align: 'center',
            title: 'Skip',
            description: 'Not for you? Skip it and move on to the next one.'
          }
        },
        {
          element: '[aria-label="Save"]',
          popover: {
            side: 'top',
            align: 'center',
            title: 'Save',
            description: 'Something worth watching? Save it and find it later in your watchlist.'
          }
        },
        {
          element: '[aria-label="Rate"]',
          popover: {
            side: 'top',
            align: 'center',
            title: 'Rate',
            description: 'Already seen it? Rate it and Flick will get better at knowing your taste.'
          }
        },
        {
          element: '[aria-label="Go back"]',
          popover: {
            side: 'top',
            align: 'center',
            title: 'Go back',
            description: 'Changed your mind? Step back one movie anytime.',
            doneBtnText: 'Start discovering'
          }
        }
      ],
      onDestroyStarted: () => {
        markSeen('discovery_tour_seen')
        driverObj.destroy()
      }
    })

    driverObj.drive()
  }, [])

  return { startTour }
}
