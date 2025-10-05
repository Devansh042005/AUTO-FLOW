'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MinusCircle, Info, CheckCircle2, AlertCircle, Loader2, ExternalLink } from 'lucide-react'
import { notify } from '@/lib/notifications'
import { usePlaceholderData } from '@/hooks/usePlaceholderData'
import { InfoTooltip } from '@/components/ui/tooltip'

type TransactionState = 'idle' | 'pending' | 'success' | 'error'

export default function WithdrawForm() {
  const [amount, setAmount] = useState('')
  const [txState, setTxState] = useState<TransactionState>('idle')
  const [txHash, setTxHash] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const { isConnected, vaultData } = usePlaceholderData()

  const handleWithdraw = async () => {
    if (!isConnected) {
      notify.error('Please connect your wallet first')
      return
    }

    if (!amount || parseFloat(amount) <= 0) {
      notify.error('Please enter a valid amount')
      return
    }

    if (parseFloat(amount) > 15234.56) {
      notify.error('Insufficient vault balance')
      return
    }

    setTxState('pending')
    setErrorMessage('')

    const toastId = notify.loading('Submitting withdraw transaction...')

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
        notify.success(`Successfully withdrew ${amount} USDC!`)
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
      notify.error(error.message || 'Withdrawal failed. Please try again.')
    }
  }

  const handleMaxClick = () => setAmount('15234.56')

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
            Withdrawn!
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
        return 'Withdraw from Vault'
    }
  }

  return (
    <Card className="rounded-3xl bg-[rgba(26,31,46,0.9)] backdrop-blur-xl border border-white/10 hover:shadow-xl hover:shadow-pink-500/10 transition-all h-full">
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-pink-400 to-rose-500 shadow-lg shadow-pink-500/30">
            <MinusCircle className="text-white" size={24} />
          </div>
          <div>
            <h3 className="font-bold text-white text-lg mb-0.5">
              Withdraw
            </h3>
            <p className="text-white/70 text-sm">
              Remove funds from vault
            </p>
          </div>
        </div>

        <div className="mb-4">
          <Label htmlFor="withdraw-amount" className="text-white/70 mb-2 block">Amount</Label>
          <div className="relative">
            <Input
              id="withdraw-amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-lg font-semibold rounded-xl bg-white/5 text-white border-white/10 placeholder:text-white/30 pr-20 h-12 focus-visible:ring-pink-500"
            />
            <Button
              size="sm"
              onClick={handleMaxClick}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-br from-pink-400 to-rose-500 text-white rounded-lg font-bold px-4 hover:from-pink-500 hover:to-rose-600 h-8"
            >
              MAX
            </Button>
          </div>
        </div>

        <div className="bg-white/5 rounded-xl border border-white/10 p-4 mb-4 space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-white/70 text-sm font-semibold">
                Vault Balance
              </span>
              <InfoTooltip
                title="Vault Balance"
                description="Your deposited balance in the vault, including earned rewards."
              />
            </div>
            <span className="font-bold text-white">
              15,234.56 USDC
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white/70 text-sm font-semibold">
              Status
            </span>
            <div className="flex items-center gap-1">
              <Info size={14} className="text-cyan-400" />
              <span className="font-bold text-cyan-400 text-sm">
                No lock-up period
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
            <p className="text-sm text-yellow-400">Please connect your wallet to withdraw</p>
          </div>
        )}

        <Button
          size="lg"
          variant="outline"
          className={`w-full py-6 text-base font-bold rounded-xl border-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
            txState === 'success'
              ? 'bg-green-500 border-green-500 text-white hover:bg-green-600'
              : txState === 'error'
              ? 'bg-red-500 border-red-500 text-white hover:bg-red-600'
              : 'border-pink-400/30 text-pink-400 hover:border-pink-400 hover:bg-pink-400/10'
          }`}
          onClick={handleWithdraw}
          disabled={isDisabled}
          aria-label="Withdraw funds from vault"
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
