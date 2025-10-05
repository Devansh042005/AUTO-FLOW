'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { PlusCircle, TrendingUp, CheckCircle2, AlertCircle, Loader2, ExternalLink } from 'lucide-react'
import { notify } from '@/lib/notifications'
import { usePlaceholderData } from '@/hooks/usePlaceholderData'
import { InfoTooltip } from '@/components/ui/tooltip'

type TransactionState = 'idle' | 'pending' | 'success' | 'error'

export default function DepositForm() {
  const [amount, setAmount] = useState('')
  const [txState, setTxState] = useState<TransactionState>('idle')
  const [txHash, setTxHash] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const { isConnected, vaultData } = usePlaceholderData()

  const handleDeposit = async () => {
    if (!isConnected) {
      notify.error('Please connect your wallet first')
      return
    }

    if (!amount || parseFloat(amount) <= 0) {
      notify.error('Please enter a valid amount')
      return
    }

    if (parseFloat(amount) > 10000) {
      notify.error('Insufficient balance')
      return
    }

    setTxState('pending')
    setErrorMessage('')

    const toastId = notify.loading('Submitting deposit transaction...')

    try {
      // Simulate transaction
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Simulate random success/failure
      const success = Math.random() > 0.1

      if (success) {
        const mockHash = `0x${Math.random().toString(16).substr(2, 64)}`
        setTxHash(mockHash)
        setTxState('success')
        notify.dismiss(toastId)
        notify.transaction(mockHash, 'success', 'testnet')
        notify.success(`Successfully deposited ${amount} USDC!`)
        setAmount('')

        // Reset success state after 5 seconds
        setTimeout(() => setTxState('idle'), 5000)
      } else {
        throw new Error('Transaction failed: Insufficient gas or network error')
      }
    } catch (error: any) {
      setTxState('error')
      setErrorMessage(error.message || 'Transaction failed')
      notify.dismiss(toastId)
      notify.error(error.message || 'Deposit failed. Please try again.')
    }
  }

  const handleMaxClick = () => {
    setAmount('10000')
  }

  const isDisabled = !isConnected || !amount || parseFloat(amount) <= 0 || txState === 'pending'

  const getButtonContent = () => {
    switch (txState) {
      case 'pending':
        return (
          <>
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            Processing...
          </>
        )
      case 'success':
        return (
          <>
            <CheckCircle2 className="w-5 h-5 mr-2" />
            Deposited!
          </>
        )
      case 'error':
        return (
          <>
            <AlertCircle className="w-5 h-5 mr-2" />
            Try Again
          </>
        )
      default:
        return 'Deposit to Vault'
    }
  }

  return (
    <Card className="rounded-3xl bg-[rgba(26,31,46,0.9)] backdrop-blur-xl border border-white/10 hover:shadow-xl hover:shadow-indigo-500/10 transition-all h-full">
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-700 shadow-lg shadow-indigo-500/30">
            <PlusCircle className="text-white" size={24} />
          </div>
          <div>
            <h3 className="font-bold text-white text-lg mb-0.5">
              Deposit
            </h3>
            <p className="text-white/70 text-sm">
              Add funds to vault
            </p>
          </div>
        </div>

        <div className="mb-4">
          <Label htmlFor="deposit-amount" className="text-white/70 mb-2 block">Amount</Label>
          <div className="relative">
            <Input
              id="deposit-amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-lg font-semibold rounded-xl bg-white/5 text-white border-white/10 placeholder:text-white/30 pr-20 h-12 focus-visible:ring-indigo-500"
            />
            <Button
              size="sm"
              onClick={handleMaxClick}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-br from-indigo-500 to-purple-700 text-white rounded-lg font-bold px-4 hover:from-indigo-600 hover:to-purple-800 h-8"
            >
              MAX
            </Button>
          </div>
        </div>

        <div className="bg-white/5 rounded-xl border border-white/10 p-4 mb-4 space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-white/70 text-sm font-semibold">
                Available Balance
              </span>
              <InfoTooltip
                title="Available Balance"
                description="This is your wallet balance available for deposit into the vault."
              />
            </div>
            <span className="font-bold text-white">
              10,000.00 USDC
            </span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-white/70 text-sm font-semibold">
                Est. Daily Earnings
              </span>
              <InfoTooltip
                title="Estimated Earnings"
                description="Expected daily earnings based on current APY. Actual returns may vary."
              />
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp size={14} className="text-green-400" />
              <span className="font-bold text-green-400 text-sm">
                +0.1% APY
              </span>
            </div>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-400">{errorMessage}</p>
          </div>
        )}

        {!isConnected && (
          <div className="mb-4 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-400">Please connect your wallet to deposit</p>
          </div>
        )}

        <Button
          size="lg"
          className={`w-full py-6 text-base font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
            txState === 'success'
              ? 'bg-green-500 hover:bg-green-600'
              : txState === 'error'
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-gradient-to-br from-indigo-500 to-purple-700 hover:from-indigo-600 hover:to-purple-800 shadow-lg'
          }`}
          onClick={handleDeposit}
          disabled={isDisabled}
          aria-label="Deposit funds to vault"
        >
          {getButtonContent()}
        </Button>

        {txHash && txState === 'success' && (
          <a
            href={`https://testnet.flowscan.org/transaction/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm mt-3 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            View on FlowScan
          </a>
        )}

        <p className="text-white/50 text-sm text-center mt-3">
          Gas fee: ~0.001 FLOW
        </p>
      </CardContent>
    </Card>
  )
}
