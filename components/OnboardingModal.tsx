'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  X,
  Wallet,
  PlusCircle,
  Leaf,
  Calendar,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react'

interface OnboardingStep {
  title: string
  description: string
  icon: React.ReactNode
  tips: string[]
}

const steps: OnboardingStep[] = [
  {
    title: 'Welcome to AutoFlow',
    description: 'AutoFlow is a yield optimizer on Flow blockchain that automatically compounds your returns using Cadence smart contracts.',
    icon: <Wallet className="w-10 h-10 text-indigo-400" />,
    tips: [
      'Connect your wallet to get started',
      'Ensure you\'re on Flow Testnet',
      'Keep some FLOW for gas fees',
    ],
  },
  {
    title: 'Deposit Funds',
    description: 'Add your tokens to the AutoFlow vault to start earning optimized yields automatically.',
    icon: <PlusCircle className="w-10 h-10 text-purple-400" />,
    tips: [
      'Enter the amount you want to deposit',
      'Click "MAX" for maximum balance',
      'Review estimated earnings before depositing',
    ],
  },
  {
    title: 'Harvest Rewards',
    description: 'Claim your accumulated yield and compound it back into the vault for maximum returns.',
    icon: <Leaf className="w-10 h-10 text-green-400" />,
    tips: [
      'Monitor your estimated profit',
      'Performance fee: 10% of profits',
      'Caller reward: 1% (if triggered by others)',
    ],
  },
  {
    title: 'Schedule Auto-Harvest',
    description: 'Enable automated harvesting to compound your returns without manual intervention.',
    icon: <Calendar className="w-10 h-10 text-orange-400" />,
    tips: [
      'Select your preferred harvest interval',
      'Minimum interval is 1 hour',
      'Track total runs and next execution time',
    ],
  },
]

export default function OnboardingModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    // Check if user has seen onboarding
    const hasSeenOnboarding = localStorage.getItem('autoflow_onboarding_completed')
    if (!hasSeenOnboarding) {
      setIsOpen(true)
    }
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    localStorage.setItem('autoflow_onboarding_completed', 'true')
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleClose()
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    handleClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl"
          >
            <Card className="bg-gradient-to-br from-zinc-900 to-black border border-white/10 shadow-2xl rounded-3xl overflow-hidden">
              <CardContent className="p-8 relative">
                {/* Close Button */}
                <button
                  onClick={handleClose}
                  className="absolute top-6 right-6 text-white/60 hover:text-white transition"
                  aria-label="Close onboarding"
                >
                  <X className="w-6 h-6" />
                </button>

                {/* Progress Indicator */}
                <div className="flex gap-2 mb-8">
                  {steps.map((_, index) => (
                    <div
                      key={index}
                      className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                        index === currentStep
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-600'
                          : index < currentStep
                          ? 'bg-green-500'
                          : 'bg-white/10'
                      }`}
                    />
                  ))}
                </div>

                {/* Content */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Icon */}
                    <div className="flex items-center justify-center mb-6">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border border-indigo-500/30 flex items-center justify-center">
                        {steps[currentStep].icon}
                      </div>
                    </div>

                    {/* Title & Description */}
                    <h2 className="text-3xl font-bold text-white text-center mb-4">
                      {steps[currentStep].title}
                    </h2>
                    <p className="text-white/70 text-center text-lg mb-8 leading-relaxed">
                      {steps[currentStep].description}
                    </p>

                    {/* Tips */}
                    <div className="bg-white/5 rounded-2xl border border-white/10 p-6 mb-8">
                      <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wide mb-4">
                        Quick Tips
                      </h3>
                      <ul className="space-y-3">
                        {steps[currentStep].tips.map((tip, index) => (
                          <li key={index} className="flex items-start gap-3 text-white/80">
                            <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                <div className="flex items-center justify-between gap-4">
                  <Button
                    variant="ghost"
                    onClick={handleSkip}
                    className="text-white/60 hover:text-white hover:bg-white/10"
                  >
                    Skip Tutorial
                  </Button>

                  <div className="flex gap-3">
                    {currentStep > 0 && (
                      <Button
                        variant="outline"
                        onClick={handlePrev}
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                      </Button>
                    )}
                    <Button
                      onClick={handleNext}
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold px-6 hover:from-indigo-600 hover:to-purple-700"
                    >
                      {currentStep === steps.length - 1 ? "Let's Go!" : 'Next'}
                      {currentStep < steps.length - 1 && (
                        <ArrowRight className="w-4 h-4 ml-2" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Step Counter */}
                <div className="text-center mt-6 text-white/50 text-sm">
                  Step {currentStep + 1} of {steps.length}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
