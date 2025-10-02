'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MinusCircle, Info } from 'lucide-react'
import { alpha } from '@mui/material'

export default function WithdrawForm() {
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)

  const handleWithdraw = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setAmount('')
      alert(`Withdrawn ${amount} USDC successfully!`)
    }, 2000)
  }

  const handleMaxClick = () => setAmount('15234.56')

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
            <span className="text-white/70 text-sm font-semibold">
              Vault Balance
            </span>
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

        <Button
          size="lg"
          variant="outline"
          className="w-full py-6 text-base font-bold rounded-xl border-2 border-pink-400/30 text-pink-400 hover:border-pink-400 hover:bg-pink-400/10 transition-all"
          onClick={handleWithdraw}
          disabled={!amount || loading}
        >
          {loading ? 'Processing...' : 'Withdraw from Vault'}
        </Button>

        <p className="text-white/50 text-sm text-center mt-3">
          Gas fee: ~0.001 FLOW
        </p>
      </CardContent>
    </Card>
  )
}
