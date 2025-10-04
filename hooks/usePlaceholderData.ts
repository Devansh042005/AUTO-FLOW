'use client'

import { useState, useEffect } from 'react'
import { usePrivy } from '@privy-io/react-auth'

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
  const { ready, authenticated, user, login, logout } = usePrivy()
  const [userAddress, setUserAddress] = useState<string | null>(null)

  // Update user address when authenticated
  useEffect(() => {
    if (authenticated && user?.wallet?.address) {
      setUserAddress(user.wallet.address)
    } else {
      setUserAddress(null)
    }
  }, [authenticated, user])

  const isConnected = ready && authenticated

  // TODO: Fetch actual balance from blockchain
  // For now, using wallet connection state to determine if we show real or mock data
  const [walletBalance, setWalletBalance] = useState<number>(0)

  useEffect(() => {
    // Fetch wallet balance when connected
    if (isConnected && userAddress) {
      // TODO: Replace with actual Flow blockchain call
      // For demo purposes, simulating an API call
      const fetchBalance = async () => {
        try {
          // Simulated balance fetch - replace with actual Flow SDK call
          // const balance = await fcl.query({ ... })
          setWalletBalance(15234.56) // Mock value for now
        } catch (error) {
          console.error('Error fetching balance:', error)
          setWalletBalance(0)
        }
      }
      fetchBalance()
    } else {
      setWalletBalance(0)
    }
  }, [isConnected, userAddress])

  // Vault data - now dynamic based on wallet connection
  const vaultData: VaultData = {
    balance: isConnected ? walletBalance : 0,
    totalEarned: isConnected ? 1847.32 : 0, // TODO: Fetch from blockchain
    lastHarvestTime: isConnected ? Math.floor(Date.now() / 1000) - 7200 : 0, // 2 hours ago
    apy: isConnected ? 12.5 : 0, // TODO: Fetch from blockchain
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

  // Wallet connection using Privy
  const connectWallet = async () => {
    try {
      await login()
      // User state will be updated through useEffect above
    } catch (error) {
      console.error('Error connecting wallet:', error)
    }
  }

  const disconnectWallet = async () => {
    try {
      await logout()
      // User state will be updated through useEffect above
    } catch (error) {
      console.error('Error disconnecting wallet:', error)
    }
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
