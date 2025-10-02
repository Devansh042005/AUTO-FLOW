'use client'

import { Card, CardContent } from '@/components/ui/card'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { TrendingUp, LineChart } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function PerformanceChart() {
  const [chartType, setChartType] = useState<'balance' | 'earned'>('balance')
  
  // Generate sample data for 30 days
  const performanceData = Array.from({ length: 30 }, (_, i) => {
    const day = i + 1
    const balanceBase = 10000 + (i * 175) // Growing from 10k to ~15k
    const earnedBase = i * 62 // Growing from 0 to ~1.8k
    return {
      day: `Day ${day}`,
      balance: Math.round(balanceBase + Math.random() * 200),
      earned: Math.round(earnedBase + Math.random() * 50)
    }
  })

  return (
    <Card className="bg-[#212537] backdrop-blur-xl border border-zinc-800/80 shadow-lg rounded-2xl transition group hover:shadow-indigo-400/10 hover:border-indigo-400/25">
      <CardContent className="p-6 space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-indigo-400 to-cyan-400 rounded-lg shadow-lg">
              <LineChart className="text-white w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-lg text-indigo-300">Performance</div>
              <div className="text-white/70 text-xs">Track vault growth</div>
            </div>
          </div>
          <ToggleGroup type="single" value={chartType} onValueChange={(value) => value && setChartType(value as 'balance' | 'earned')} className="bg-[#1c2030] rounded-lg shadow-inner">
            <ToggleGroupItem value="balance" className={cn('font-semibold px-4 py-2 text-base rounded-lg', chartType === 'balance' ? 'bg-gradient-to-r from-indigo-400 to-cyan-400 text-white' : 'text-white/80 hover:bg-indigo-700/70')}>
              Balance
            </ToggleGroupItem>
            <ToggleGroupItem value="earned" className={cn('font-semibold px-4 py-2 text-base rounded-lg', chartType === 'earned' ? 'bg-gradient-to-r from-green-400 to-cyan-400 text-white' : 'text-white/80 hover:bg-green-700/70')}>
              Earned
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        
        {/* Chart */}
        <div className="w-full h-80 mt-6 mb-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={performanceData}>
              <defs>
                <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="earnedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4ade80" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#4ade80" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
              <XAxis 
                dataKey="day" 
                stroke="#9ca3af" 
                fontSize={12}
                tickLine={false}
              />
              <YAxis 
                stroke="#9ca3af" 
                fontSize={12}
                tickLine={false}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1c2030', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff'
                }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, chartType === 'balance' ? 'Balance' : 'Earned']}
              />
              <Area 
                type="monotone" 
                dataKey={chartType} 
                stroke={chartType === 'balance' ? '#818cf8' : '#4ade80'} 
                strokeWidth={3}
                fill={chartType === 'balance' ? 'url(#balanceGradient)' : 'url(#earnedGradient)'} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="p-5 rounded-xl bg-gradient-to-br from-indigo-400/10 to-cyan-400/10 border border-indigo-300/20">
            <div className="uppercase text-xs text-white/70 font-semibold mb-1">30-Day Growth</div>
            <div className="font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 text-2xl mt-1">
              +45.7%
            </div>
          </div>
          <div className="p-5 rounded-xl bg-gradient-to-br from-green-400/10 to-cyan-400/10 border border-green-300/20">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="uppercase text-xs text-white/70 font-semibold">Total Earned</span>
            </div>
            <div className="font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400 text-2xl">
              $1,847.32
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}