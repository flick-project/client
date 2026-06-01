import { useState, useRef, useEffect, useCallback } from 'react'

/**
 *
 */
export function useDropdown () {
  const [isOpen, setIsOpen] = useState(false)
  const triggerRef = useRef(null)
  const menuRef = useRef(null)

  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen(prev => !prev), [])
  const open = useCallback(() => setIsOpen(true), [])

  // Close on click outside.
  useEffect(() => {
    if (!isOpen) return
    const handleClickOutside = (event) => {
      if (triggerRef.current?.contains(event.target)) return
      if (menuRef.current && !menuRef.current.contains(event.target)) close()
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, close])

  // Close on Escape.
  useEffect(() => {
    if (!isOpen) return
    const handleEscape = (e) => { if (e.key === 'Escape') close() }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, close])

  // Focus first menu item when opened.
  useEffect(() => {
    if (isOpen && menuRef.current) {
      const firstItem = menuRef.current.querySelector('a, button')
      firstItem?.focus()
    }
  }, [isOpen])

  return { isOpen, toggle, open, close, triggerRef, menuRef }
}
