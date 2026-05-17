import { useState } from 'react'
import { useToast } from '../hooks/useToast'
import Modal from './Modal.jsx'
import AuthModal from './AuthModal.jsx'
import OnboardingModal from './OnboardingModal.jsx'

/**
 * Handles the auth and onboarding flow.
 * @param {object} props - Component props.
 * @param {() => void} props.onClose - Callback to close the modal.
 * @returns {React.ReactElement} The AuthModal component.
 */
export default function AuthFlow ({ onClose }) {
  const { showToast } = useToast()
  const [step, setStep] = useState('auth')

  const handleComplete = (message) => {
    showToast(message, 'success')
    onClose()
  }

  let content
  if (step === 'auth') content = <AuthModal onLoginSuccess={handleComplete} onRegisterSuccess={() => setStep('onboarding')} />
  if (step === 'onboarding') content = <OnboardingModal onComplete={handleComplete} />

  return (
    <Modal onClose={onClose} wide={step === 'onboarding'}>
      {content}
    </Modal>
  )
}
