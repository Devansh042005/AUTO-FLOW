'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { usePlaceholderData } from '@/hooks/usePlaceholderData'
import { formatAddress } from '@/utils/formatters'
import {
  LayoutDashboard,
  Building2,
  Puzzle,
  BookOpen,
  Wallet,
} from 'lucide-react'

export default function Header() {
  const { isConnected, userAddress, connectWallet, disconnectWallet } = usePlaceholderData()
  const [activeTab, setActiveTab] = useState('Dashboard')

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard },
    { label: 'Vaults', icon: Building2 },
    { label: 'Actions', icon: Puzzle },
    { label: 'Docs', icon: BookOpen },
  ]

  const handleNavClick = (label: string) => {
    setActiveTab(label)
    // Scroll to section or handle navigation
    if (label === 'Dashboard') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else if (label === 'Vaults') {
      const vaultSection = document.querySelector('[data-section="vaults"]')
      vaultSection?.scrollIntoView({ behavior: 'smooth' })
    } else if (label === 'Actions') {
      const actionsSection = document.querySelector('[data-section="actions"]')
      actionsSection?.scrollIntoView({ behavior: 'smooth' })
    } else if (label === 'Docs') {
      window.open('https://flow.com/docs', '_blank')
    }
  }

  return (
    <header className="sticky top-0 z-20 backdrop-blur-xl bg-[rgba(26,31,46,0.8)] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-5">
        <nav className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-700 shadow-lg hover:scale-105 transition">
              <span className="text-white font-black text-lg tracking-wide select-none">AF</span>
            </div>
            <div>
              <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-700 text-xl">
                AutoFlow
              </span>
              <div className="uppercase tracking-widest text-xs text-white/60 font-semibold">
                Flow Yield Optimizer
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map(item => {
              const Icon = item.icon
              const isActive = activeTab === item.label
              return (
                <Button
                  key={item.label}
                  variant="ghost"
                  onClick={() => handleNavClick(item.label)}
                  className={cn(
                    'relative rounded-lg font-semibold px-4 py-2 transition-all cursor-pointer',
                    isActive
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-700 text-white shadow-lg hover:from-indigo-600 hover:to-purple-800'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  )}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  <span>{item.label}</span>
                </Button>
              )
            })}
          </div>

          {/* Wallet Connect */}
          <div>
            {isConnected ? (
              <div className="flex items-center gap-2">
                <Badge className="px-3 py-1.5 bg-gradient-to-r from-green-400 to-cyan-400 text-zinc-900 text-xs font-bold border-0">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse mr-2" />
                  {formatAddress(userAddress || '')}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  className="border border-red-400/30 text-red-400 hover:border-red-500 hover:bg-red-500/10"
                  onClick={disconnectWallet}
                >
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button
                className="bg-gradient-to-r from-indigo-500 to-purple-700 font-bold px-6 h-11 rounded-lg text-base shadow-lg transition hover:from-indigo-600 hover:to-purple-800 hover:scale-105"
                onClick={connectWallet}
              >
                <Wallet className="w-5 h-5 mr-2" />
                Connect Wallet
              </Button>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}
