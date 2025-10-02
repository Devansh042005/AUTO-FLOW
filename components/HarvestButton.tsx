'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Leaf, TrendingUp } from 'lucide-react'
import { usePlaceholderData } from '@/hooks/usePlaceholderData'
import { formatCurrency, formatDateTime } from '@/utils/formatters'

export default function HarvestButton() {
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { vaultData } = usePlaceholderData()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleHarvest = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      alert('Harvest executed successfully! Profit: $12.34')
    }, 2000)
  }

  const estimatedProfit = 12.34

  return (
    <Card className="rounded-3xl bg-[rgba(26,31,46,0.9)] backdrop-blur-xl border border-white/10 hover:shadow-xl hover:shadow-green-500/10 transition-all h-full">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-green-400 to-teal-400 shadow-lg shadow-green-500/30">
              <Leaf className="text-white" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg mb-0.5">
                Harvest Yield
              </h3>
              <p className="text-white/70 text-sm">
                Compound your returns
              </p>
            </div>
          </div>
          <Badge className="bg-green-400/10 border border-green-400 text-green-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse mr-2" />
            Ready
          </Badge>
        </div>

        <div className="p-4 rounded-xl bg-gradient-to-br from-green-900/40 to-teal-900/40 border border-green-400/20 mb-4">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp size={18} className="text-green-400" />
              <span className="text-xs text-white/80 uppercase font-bold tracking-wider">
                Estimated Profit
              </span>
            </div>
            <span className="text-2xl font-extrabold bg-gradient-to-br from-green-400 to-teal-400 bg-clip-text text-transparent">
              {formatCurrency(estimatedProfit)}
            </span>
          </div>

          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-white/70">Performance Fee (10%)</span>
            <span className="font-bold text-white">{formatCurrency(estimatedProfit * 0.1)}</span>
          </div>

          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-white/70">Caller Reward (1%)</span>
            <span className="font-bold text-white">{formatCurrency(estimatedProfit * 0.01)}</span>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-green-400/15 mt-2">
            <span className="text-xs font-bold text-green-400">Your Share (89%)</span>
            <span className="font-bold text-green-400">{formatCurrency(estimatedProfit * 0.89)}</span>
          </div>
        </div>

        <Button
          size="lg"
          className="w-full py-6 font-bold text-lg rounded-xl bg-gradient-to-br from-green-400 to-teal-400 text-zinc-900 shadow-lg transition-all hover:from-green-500 hover:to-teal-500 disabled:opacity-50"
          disabled={loading}
          onClick={handleHarvest}
        >
          {loading ? 'Harvesting...' : 'Harvest Now'}
        </Button>

        {mounted && (
          <p className="text-white/50 text-sm text-center mt-3">
            Last harvest: {formatDateTime(vaultData.lastHarvestTime)}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
