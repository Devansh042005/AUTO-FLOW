'use client'

import { Badge } from '@/components/ui/badge'
import { Tooltip } from '@/components/ui/tooltip'
import { AlertCircle, Wifi } from 'lucide-react'

interface NetworkIndicatorProps {
  network?: 'mainnet' | 'testnet' | 'emulator'
  expectedNetwork?: 'mainnet' | 'testnet' | 'emulator'
  className?: string
}

export default function NetworkIndicator({
  network = 'testnet',
  expectedNetwork = 'testnet',
  className = '',
}: NetworkIndicatorProps) {
  const isCorrectNetwork = network === expectedNetwork

  const networkColors = {
    mainnet: 'from-blue-500 to-blue-600',
    testnet: 'from-orange-500 to-orange-600',
    emulator: 'from-purple-500 to-purple-600',
  }

  const networkLabels = {
    mainnet: 'Flow Mainnet',
    testnet: 'Flow Testnet',
    emulator: 'Flow Emulator',
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Tooltip
        position="bottom"
        content={
          <div className="space-y-2">
            <div className="font-bold text-white">Network Status</div>
            <div className="text-white/80 text-xs">
              {isCorrectNetwork ? (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span>Connected to {networkLabels[network]}</span>
                  </div>
                  <div className="text-white/60">
                    All transactions will be executed on this network.
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-2 text-yellow-400">
                    <AlertCircle className="w-4 h-4" />
                    <span>Wrong Network Detected</span>
                  </div>
                  <div className="text-white/60 mb-2">
                    You are connected to {networkLabels[network]}, but this app requires {networkLabels[expectedNetwork]}.
                  </div>
                  <div className="text-white/60 font-semibold">
                    Please switch to {networkLabels[expectedNetwork]} in your wallet.
                  </div>
                </>
              )}
            </div>
          </div>
        }
      >
        <Badge
          className={`px-3 py-1.5 text-xs font-bold border-0 flex items-center gap-2 ${
            isCorrectNetwork
              ? `bg-gradient-to-r ${networkColors[network]} text-white`
              : 'bg-yellow-500/20 text-yellow-400 border border-yellow-400/30'
          }`}
        >
          {isCorrectNetwork ? (
            <Wifi className="w-3 h-3" />
          ) : (
            <AlertCircle className="w-3 h-3" />
          )}
          <span>{networkLabels[network]}</span>
        </Badge>
      </Tooltip>
    </div>
  )
}
