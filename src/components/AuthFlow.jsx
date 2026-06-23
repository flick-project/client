import { useState } from 'react'
import { useToast } from '../hooks/useToast'
import { useDiscoveryQueue } from '../hooks/useDiscoveryQueue.js'
import Modal from './Modal.jsx'
import AuthModal from './AuthModal.jsx'
import OnboardingModal from './OnboardingModal.jsx'

/**
 * Handles the auth and onboarding flow.
 * @param {object} props - Component props.
 * @param {() => void} props.onClose - Callback to close the modal.
 * @returns {React.ReactElement|null} Auth or onboarding content.
 */
export default function AuthFlow ({ onClose }) {
  const { showToast } = useToast()
  const { reset } = useDiscoveryQueue()
  const [step, setStep] = useState('auth')

  const handleComplete = (message) => {
    reset()
    if (message) showToast(message, 'success')
    onClose()
  }

  let content
  if (step === 'auth') content = <AuthModal onLoginSuccess={handleComplete} onRegisterSuccess={() => setStep('onboarding')} />
  if (step === 'onboarding') content = <OnboardingModal onComplete={handleComplete} />

  return content
}
