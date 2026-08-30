import { useState } from 'react'
import { useDiscoveryQueue } from '../hooks/useDiscoveryQueue.js'
import { useDiscoveryTour } from '../hooks/useDiscoveryTour.js'
import { toast } from 'sonner'
import Modal from './Modal.jsx'
import AuthModal from './AuthModal.jsx'
import OnboardingModal from './OnboardingModal.jsx'

/**
 * Handles the auth and onboarding flow.
 * @param {object} props - Component props.
 * @param {() => void} props.isOpen - Callback to close the modal
 * @param {() => void} props.onClose - Callback to close the modal.
 * @returns {React.ReactElement|null} Auth or onboarding content.
 */
export default function AuthFlow ({ isOpen, onClose }) {
  const { reset } = useDiscoveryQueue()
  const { startTour } = useDiscoveryTour()
  const [step, setStep] = useState('auth')

  const handleClose = () => {
    setStep('auth')
    onClose()
  }

  const handleComplete = (message) => {
    setStep('auth')
    reset()
    if (message) toast.success(message)
    onClose()

    startTour()
  }

  let content
  if (step === 'auth') content = <AuthModal onLoginSuccess={handleComplete} onRegisterSuccess={() => setStep('onboarding')} />
  if (step === 'onboarding') content = <OnboardingModal onComplete={handleComplete} />

  return (
    <Modal isOpen={isOpen} onClose={handleClose} wide={step === 'onboarding'}>
      {isOpen && content}
    </Modal>
  )
}
