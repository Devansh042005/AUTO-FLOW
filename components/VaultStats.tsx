'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  TrendingUp,
  Wallet,
  DollarSign,
  Percent,
  ArrowUp,
} from 'lucide-react'
import { usePlaceholderData } from '@/hooks/usePlaceholderData'
import { formatCurrency, formatPercentage, formatCompactNumber } from '@/utils/formatters'

const icons = {
  Wallet: <Wallet size={28} />,
  DollarSign: <DollarSign size={28} />,
  Percent: <Percent size={28} />,
  TrendingUp: <TrendingUp size={28} />,
}

const gradients = {
  blue: 'bg-gradient-to-tr from-indigo-500 to-violet-700',
  pink: 'bg-gradient-to-tr from-pink-300 to-rose-400',
  cyan: 'bg-gradient-to-tr from-sky-400 to-cyan-500',
  green: 'bg-gradient-to-tr from-green-400 to-cyan-400',
}

export default function VaultStats() {
  const { vaultData, protocolStats } = usePlaceholderData()

  const stats = [
    {
      title: 'Your Balance',
      value: formatCurrency(vaultData.balance),
      change: '+12.5%',
      subtitle: 'Last 30 days',
      icon: icons.Wallet,
      gradient: gradients.blue,
      color: 'indigo-400',
    },
    {
      title: 'Total Earned',
      value: formatCurrency(vaultData.totalEarned),
      change: '+8.3%',
      subtitle: 'All time',
      icon: icons.DollarSign,
      gradient: gradients.pink,
      color: 'pink-400',
    },
    {
      title: 'Current APY',
      value: formatPercentage(vaultData.apy),
      change: 'Annual',
      subtitle: 'Variable rate',
      icon: icons.Percent,
      gradient: gradients.cyan,
      color: 'cyan-400',
    },
    {
      title: 'Protocol TVL',
      value: formatCompactNumber(protocolStats.totalValueLocked),
      change: `${protocolStats.totalUsers} users`,
      subtitle: 'Network wide',
      icon: icons.TrendingUp,
      gradient: gradients.green,
      color: 'green-400',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
      {stats.map((stat, i) => (
        <Card
          key={i}
          className={`relative flex flex-col h-full rounded-3xl bg-black/80 border
            border-zinc-700 backdrop-blur-lg transition-all hover:-translate-y-2
            hover:shadow-lg hover:border-${stat.color}`}
        >
          <CardContent className="p-5 space-y-2">
            <div className="flex items-center justify-between mb-2">
              <div className={`w-14 h-14 flex items-center justify-center rounded-xl text-white shadow-xl ${stat.gradient} transition-transform duration-300 hover:scale-105 hover:rotate-3`}>
                {stat.icon}
              </div>
              <Badge className={`bg-${stat.color}/20 text-${stat.color} font-semibold px-2 py-1 border border-${stat.color}/20`}>
                <ArrowUp size={14} className="inline mr-1" /> {stat.change}
              </Badge>
            </div>
            <div className="uppercase tracking-wide font-semibold text-zinc-400 mb-1 text-xs">
              {stat.title}
            </div>
            <div className={`font-extrabold text-2xl md:text-3xl text-white`}>
              {stat.value}
            </div>
            <div className="text-gray-400 text-sm">
              {stat.subtitle}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
