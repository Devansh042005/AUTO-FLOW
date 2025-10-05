'use client'

import { ReactNode, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Info } from 'lucide-react'

interface TooltipProps {
  content: ReactNode
  children?: ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
  triggerClassName?: string
  showIcon?: boolean
}

export function Tooltip({
  content,
  children,
  position = 'top',
  className = '',
  triggerClassName = '',
  showIcon = true,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  }

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        className={`inline-flex items-center cursor-help ${triggerClassName}`}
        aria-label="More information"
      >
        {children || (showIcon && <Info className="w-4 h-4 text-white/60 hover:text-white/90 transition-colors" />)}
      </button>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`absolute z-50 ${positionClasses[position]} ${className}`}
          >
            <div className="bg-zinc-900 border border-white/20 rounded-xl px-4 py-3 shadow-2xl max-w-xs">
              <div className="text-sm text-white/90 leading-relaxed">{content}</div>
            </div>
            {/* Arrow */}
            <div
              className={`absolute w-2 h-2 bg-zinc-900 border-white/20 transform rotate-45 ${
                position === 'top'
                  ? 'bottom-[-4px] left-1/2 -translate-x-1/2 border-r border-b'
                  : position === 'bottom'
                  ? 'top-[-4px] left-1/2 -translate-x-1/2 border-l border-t'
                  : position === 'left'
                  ? 'right-[-4px] top-1/2 -translate-y-1/2 border-t border-r'
                  : 'left-[-4px] top-1/2 -translate-y-1/2 border-b border-l'
              }`}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

interface InfoTooltipProps {
  title: string
  description: string
  position?: 'top' | 'bottom' | 'left' | 'right'
}

export function InfoTooltip({ title, description, position = 'top' }: InfoTooltipProps) {
  return (
    <Tooltip
      position={position}
      content={
        <div>
          <div className="font-bold text-white mb-1">{title}</div>
          <div className="text-white/70 text-xs">{description}</div>
        </div>
      }
    />
  )
}
