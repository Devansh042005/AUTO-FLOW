'use client'

import { useState, useEffect } from 'react'

// Placeholder data types
export interface VaultData {
  balance: number
  totalEarned: number
  lastHarvestTime: number
  apy: number
}

export interface ProtocolStats {
  totalValueLocked: number
  totalFees: number
  totalUsers: number
  totalHarvests: number
}

export interface ScheduleData {
  vaultAddress: string
  interval: number
  lastExecution: number
  nextExecution: number
  totalExecutions: number
  isActive: boolean
}

export interface ActionData {
  id: string
  name: string
  description: string
  inputs: string[]
  outputs: string[]
  status: 'active' | 'pending' | 'completed'
}

export interface PerformanceData {
  date: string
  balance: number
  earned: number
}

// Custom hook to provide placeholder data
export const usePlaceholderData = () => {
  const [isConnected, setIsConnected] = useState(false)
  const [userAddress, setUserAddress] = useState<string | null>(null)

  // Vault data
  const vaultData: VaultData = {
    balance: 15234.56,
    totalEarned: 1847.32,
    lastHarvestTime: Math.floor(Date.now() / 1000) - 7200, // 2 hours ago
    apy: 12.5,
  }

  // Protocol statistics
  const protocolStats: ProtocolStats = {
    totalValueLocked: 2847653.21,
    totalFees: 34521.87,
    totalUsers: 1243,
    totalHarvests: 8765,
  }

  // Schedule data
  const scheduleData: ScheduleData = {
    vaultAddress: '0x1234567890abcdef',
    interval: 3600, // 1 hour
    lastExecution: Math.floor(Date.now() / 1000) - 1800, // 30 min ago
    nextExecution: Math.floor(Date.now() / 1000) + 1800, // 30 min from now
    totalExecutions: 47,
    isActive: true,
  }

  // Flow Actions data
  const actionsData: ActionData[] = [
    {
      id: 'vault.deposit',
      name: 'Deposit',
      description: 'Deposit funds into AutoFlow vault',
      inputs: ['amount: UFix64', 'vault: Capability'],
      outputs: ['success: Bool', 'newBalance: UFix64'],
      status: 'active',
    },
    {
      id: 'vault.withdraw',
      name: 'Withdraw',
      description: 'Withdraw funds from AutoFlow vault',
      inputs: ['amount: UFix64'],
      outputs: ['success: Bool', 'withdrawnAmount: UFix64'],
      status: 'active',
    },
    {
      id: 'vault.harvest',
      name: 'Harvest',
      description: 'Execute yield harvest and compound rewards',
      inputs: [],
      outputs: ['success: Bool', 'profit: UFix64', 'fees: UFix64'],
      status: 'active',
    },
    {
      id: 'vault.getBalance',
      name: 'Get Balance',
      description: 'Query current vault balance',
      inputs: [],
      outputs: ['balance: UFix64', 'totalEarned: UFix64'],
      status: 'active',
    },
  ]

  // Performance chart data (30 days)
  const performanceData: PerformanceData[] = Array.from(
    { length: 30 },
    (_, i) => {
      const daysAgo = 29 - i
      const date = new Date()
      date.setDate(date.getDate() - daysAgo)

      return {
        date: date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
        balance: 10000 + i * 150 + Math.random() * 200,
        earned: i * 50 + Math.random() * 30,
      }
    }
  )

  // Simulate wallet connection
  const connectWallet = () => {
    setIsConnected(true)
    setUserAddress('0x1234567890abcdef')
  }

  const disconnectWallet = () => {
    setIsConnected(false)
    setUserAddress(null)
  }

  return {
    // Connection state
    isConnected,
    userAddress,
    connectWallet,
    disconnectWallet,

    // Data
    vaultData,
    protocolStats,
    scheduleData,
    actionsData,
    performanceData,
  }
}

export default usePlaceholderData
