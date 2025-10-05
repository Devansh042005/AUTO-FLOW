'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Loader2, ExternalLink, X, CheckCircle2, XCircle } from 'lucide-react'

export interface PendingTransaction {
  id: string
  hash: string
  type: 'deposit' | 'withdraw' | 'harvest' | 'schedule' | 'cancel'
  status: 'pending' | 'success' | 'error'
  timestamp: number
  errorMessage?: string
}

interface PendingTransactionsProps {
  transactions: PendingTransaction[]
  onDismiss?: (id: string) => void
  network?: 'mainnet' | 'testnet'
}

export default function PendingTransactions({
  transactions,
  onDismiss,
  network = 'testnet',
}: PendingTransactionsProps) {
  const [visibleTxs, setVisibleTxs] = useState<PendingTransaction[]>([])

  useEffect(() => {
    setVisibleTxs(transactions)
  }, [transactions])

  const handleDismiss = (id: string) => {
    setVisibleTxs(prev => prev.filter(tx => tx.id !== id))
    onDismiss?.(id)
  }

  const getExplorerUrl = (hash: string) => {
    return network === 'mainnet'
      ? `https://flowscan.org/transaction/${hash}`
      : `https://testnet.flowscan.org/transaction/${hash}`
  }

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      deposit: 'Deposit',
      withdraw: 'Withdraw',
      harvest: 'Harvest',
      schedule: 'Schedule',
      cancel: 'Cancel',
    }
    return labels[type] || type
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Loader2 className="w-4 h-4 animate-spin" />
      case 'success':
        return <CheckCircle2 className="w-4 h-4" />
      case 'error':
        return <XCircle className="w-4 h-4" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'success':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'error':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      default:
        return 'bg-white/10 text-white/70'
    }
  }

  if (visibleTxs.length === 0) return null

  return (
    <div className="fixed bottom-6 right-6 z-40 w-96 max-w-[calc(100vw-3rem)]">
      <AnimatePresence>
        {visibleTxs.map((tx, index) => (
          <motion.div
            key={tx.id}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="mb-3"
          >
            <Card className="bg-gradient-to-br from-zinc-900 to-black border border-white/10 shadow-2xl backdrop-blur-xl">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex-shrink-0">
                      {getStatusIcon(tx.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-white mb-1">
                        {getTypeLabel(tx.type)}
                      </div>
                      <Badge className={`${getStatusColor(tx.status)} text-xs font-semibold`}>
                        {tx.status === 'pending'
                          ? 'Processing...'
                          : tx.status === 'success'
                          ? 'Confirmed'
                          : 'Failed'}
                      </Badge>
                    </div>
                  </div>
                  {tx.status !== 'pending' && (
                    <button
                      onClick={() => handleDismiss(tx.id)}
                      className="text-white/60 hover:text-white transition flex-shrink-0"
                      aria-label="Dismiss transaction"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {tx.errorMessage && (
                  <div className="mb-3 p-2 rounded-lg bg-red-500/10 border border-red-500/30">
                    <p className="text-xs text-red-400">{tx.errorMessage}</p>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="flex-1 border-white/20 text-white/80 hover:bg-white/10 hover:text-white text-xs h-8"
                  >
                    <a
                      href={getExplorerUrl(tx.hash)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2"
                    >
                      <ExternalLink className="w-3 h-3" />
                      View on FlowScan
                    </a>
                  </Button>
                </div>

                <div className="mt-2 text-xs text-white/50">
                  {new Date(tx.timestamp).toLocaleTimeString()}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

// Hook to manage pending transactions
export function usePendingTransactions() {
  const [transactions, setTransactions] = useState<PendingTransaction[]>([])

  const addTransaction = (
    type: PendingTransaction['type'],
    hash: string
  ): string => {
    const id = `${type}-${Date.now()}-${Math.random()}`
    const newTx: PendingTransaction = {
      id,
      hash,
      type,
      status: 'pending',
      timestamp: Date.now(),
    }
    setTransactions(prev => [...prev, newTx])
    return id
  }

  const updateTransaction = (
    id: string,
    status: 'success' | 'error',
    errorMessage?: string
  ) => {
    setTransactions(prev =>
      prev.map(tx =>
        tx.id === id ? { ...tx, status, errorMessage } : tx
      )
    )

    // Auto-dismiss successful transactions after 5 seconds
    if (status === 'success') {
      setTimeout(() => {
        removeTransaction(id)
      }, 5000)
    }
  }

  const removeTransaction = (id: string) => {
    setTransactions(prev => prev.filter(tx => tx.id !== id))
  }

  return {
    transactions,
    addTransaction,
    updateTransaction,
    removeTransaction,
  }
}
