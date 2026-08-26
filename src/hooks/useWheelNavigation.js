import { useEffect, useRef } from 'react'

/**
 * Debounced wheel navigation. One navigation per scroll gesture,
 * then locked for a grace period. Only reacts to vertical-dominant
 * wheel events, so horizontal trackpad gestures pass through to
 * nested scroll containers (e.g. inner carousels).
 * @param {object} options - Hook options.
 * @param {() => void} options.onNext - Called on scroll down.
 * @param {() => void} options.onPrev - Called on scroll up.
 * @param {React.RefObject<HTMLElement>} options.containerRef - Element to listen on.
 * @param {number} [options.gracePeriod] - Cooldown (ms) after navigation.
 * @param {boolean} [options.enabled] - Disables listener when false.
 */
export default function useWheelNavigation ({
  onNext,
  onPrev,
  containerRef,
  gracePeriod = 200,
  enabled = true
}) {
  const onNextRef = useRef(onNext)
  const onPrevRef = useRef(onPrev)

  const lockedRef = useRef(false)
  const debounceRef = useRef(null)
  const directionRef = useRef(0)

  useEffect(() => {
    onNextRef.current = onNext
    onPrevRef.current = onPrev
  })

  useEffect(() => {
    const el = containerRef.current
    if (!el || !enabled) return

    const handleWheel = (e) => {
      // Let horizontal-dominant gestures (trackpad two-finger horizontal,
      // shift+scroll) pass through so nested horizontal scroll containers
      // can receive them.
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return

      e.preventDefault()
      if (lockedRef.current) return

      directionRef.current = e.deltaY

      clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        if (lockedRef.current) return
        if (directionRef.current > 0) onNextRef.current()
        else if (directionRef.current < 0) onPrevRef.current()
        lockedRef.current = true
        setTimeout(() => { lockedRef.current = false }, gracePeriod)
      }, 100)
    }

    el.addEventListener('wheel', handleWheel, { passive: false })
    return () => {
      clearTimeout(debounceRef.current)
      el.removeEventListener('wheel', handleWheel)
    }
  }, [containerRef, gracePeriod, enabled])
}
