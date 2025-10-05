'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Percent,
  Activity,
} from 'lucide-react'
import { formatCurrency, formatCompactNumber, formatPercentage } from '@/utils/formatters'

interface AnalyticsProps {
  className?: string
}

export default function Analytics({ className = '' }: AnalyticsProps) {
  // Mock analytics data - would come from Dune or on-chain data
  const analyticsData = {
    tvl: {
      current: 2450000,
      change24h: 12.5,
      change7d: 28.3,
    },
    totalUsers: {
      current: 1247,
      change24h: 8.2,
      change7d: 15.6,
    },
    avgYield: {
      current: 15.7,
      change24h: 2.1,
      change7d: -3.2,
    },
    totalHarvests: {
      current: 3421,
      change24h: 45,
      change7d: 312,
    },
    volumeBreakdown: [
      { name: 'Deposits', value: 1200000, percentage: 49 },
      { name: 'Withdrawals', value: 800000, percentage: 33 },
      { name: 'Harvests', value: 450000, percentage: 18 },
    ],
    topVaults: [
      { name: 'USDC Vault', tvl: 980000, apy: 16.2, users: 423 },
      { name: 'FLOW Vault', tvl: 756000, apy: 14.8, users: 298 },
      { name: 'FUSD Vault', tvl: 714000, apy: 15.1, users: 526 },
    ],
  }

  const StatCard = ({
    title,
    value,
    change24h,
    icon: Icon,
    gradient,
  }: {
    title: string
    value: string
    change24h: number
    icon: any
    gradient: string
  }) => (
    <Card className="bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-2xl hover:shadow-lg transition-all">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
            <Icon className="text-white" size={24} />
          </div>
          <Badge className={`${change24h >= 0 ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'} font-semibold`}>
            {change24h >= 0 ? '+' : ''}{change24h.toFixed(1)}%
          </Badge>
        </div>
        <div className="text-sm text-white/60 mb-1">{title}</div>
        <div className="text-2xl font-bold text-white">{value}</div>
      </CardContent>
    </Card>
  )

  return (
    <div className={className}>
      <Card className="bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-3xl shadow-2xl">
        <CardContent className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
                <BarChart3 className="text-white" size={28} />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-1">Analytics</h2>
                <p className="text-white/60">Protocol performance metrics</p>
              </div>
            </div>
            <Badge className="bg-purple-500/20 text-purple-400 border border-purple-500/30 px-4 py-2">
              Live Data
            </Badge>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              title="Total Value Locked"
              value={formatCurrency(analyticsData.tvl.current)}
              change24h={analyticsData.tvl.change24h}
              icon={DollarSign}
              gradient="from-indigo-500 to-purple-600"
            />
            <StatCard
              title="Total Users"
              value={formatCompactNumber(analyticsData.totalUsers.current)}
              change24h={analyticsData.totalUsers.change24h}
              icon={Users}
              gradient="from-cyan-500 to-blue-600"
            />
            <StatCard
              title="Average Yield"
              value={formatPercentage(analyticsData.avgYield.current)}
              change24h={analyticsData.avgYield.change24h}
              icon={Percent}
              gradient="from-green-500 to-teal-600"
            />
            <StatCard
              title="Total Harvests"
              value={formatCompactNumber(analyticsData.totalHarvests.current)}
              change24h={analyticsData.totalHarvests.change24h}
              icon={Activity}
              gradient="from-orange-500 to-red-600"
            />
          </div>

          {/* Volume Breakdown */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="text-purple-400" size={20} />
              Volume Breakdown (24h)
            </h3>
            <div className="space-y-3">
              {analyticsData.volumeBreakdown.map((item, index) => (
                <div key={index} className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-white">{item.name}</span>
                    <span className="text-white/80">{formatCurrency(item.value)}</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-600 rounded-full transition-all"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <div className="text-xs text-white/50 mt-1">{item.percentage}% of total</div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Vaults */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <BarChart3 className="text-cyan-400" size={20} />
              Top Performing Vaults
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {analyticsData.topVaults.map((vault, index) => (
                <Card key={index} className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-xl hover:border-purple-500/50 transition-all">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-600" />
                      <h4 className="font-bold text-white">{vault.name}</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-white/60">TVL</span>
                        <span className="font-semibold text-white text-sm">{formatCurrency(vault.tvl)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-white/60">APY</span>
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                          {vault.apy.toFixed(1)}%
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-white/60">Users</span>
                        <span className="font-semibold text-white text-sm">{vault.users}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Dune Integration Placeholder */}
          <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/30">
            <div className="flex items-start gap-3">
              <BarChart3 className="text-purple-400 flex-shrink-0" size={24} />
              <div>
                <h4 className="font-bold text-purple-300 mb-2">Advanced Analytics (Coming Soon)</h4>
                <p className="text-white/70 text-sm leading-relaxed">
                  Integrate with Dune Analytics for real-time on-chain metrics, custom dashboards,
                  and advanced protocol insights. Track user behavior, transaction patterns, and more.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
