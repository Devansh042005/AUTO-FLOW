'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { PlusCircle, TrendingUp } from 'lucide-react'

export default function DepositForm() {
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)

  const handleDeposit = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setAmount('')
      alert(`Deposited ${amount} USDC successfully!`)
    }, 2000)
  }

  const handleMaxClick = () => {
    setAmount('10000')
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
            <span className="text-white/70 text-sm font-semibold">
              Available Balance
            </span>
            <span className="font-bold text-white">
              10,000.00 USDC
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white/70 text-sm font-semibold">
              Est. Daily Earnings
            </span>
            <div className="flex items-center gap-1">
              <TrendingUp size={14} className="text-green-400" />
              <span className="font-bold text-green-400 text-sm">
                +0.1% APY
              </span>
            </div>
          </div>
        </div>

        <Button
          size="lg"
          className="w-full py-6 text-base font-bold rounded-xl bg-gradient-to-br from-indigo-500 to-purple-700 text-white shadow-lg hover:from-indigo-600 hover:to-purple-800 transition-all disabled:opacity-50"
          onClick={handleDeposit}
          disabled={!amount || loading}
        >
          {loading ? 'Processing...' : 'Deposit to Vault'}
        </Button>

        <p className="text-white/50 text-sm text-center mt-3">
          Gas fee: ~0.001 FLOW
        </p>
      </CardContent>
    </Card>
  )
}
