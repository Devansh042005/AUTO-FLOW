'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Activity,
  PlusCircle,
  MinusCircle,
  Leaf,
  Calendar,
  ExternalLink,
  Clock,
} from 'lucide-react'
import { formatCurrency, formatDateTime } from '@/utils/formatters'

export interface ActivityItem {
  id: string
  type: 'deposit' | 'withdraw' | 'harvest' | 'schedule' | 'cancel'
  amount?: number
  timestamp: number
  hash: string
  status: 'success' | 'pending' | 'error'
}

interface ActivityFeedProps {
  activities: ActivityItem[]
  maxItems?: number
  network?: 'mainnet' | 'testnet'
}

export default function ActivityFeed({
  activities,
  maxItems = 5,
  network = 'testnet',
}: ActivityFeedProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <PlusCircle className="w-5 h-5 text-indigo-400" />
      case 'withdraw':
        return <MinusCircle className="w-5 h-5 text-pink-400" />
      case 'harvest':
        return <Leaf className="w-5 h-5 text-green-400" />
      case 'schedule':
        return <Calendar className="w-5 h-5 text-orange-400" />
      case 'cancel':
        return <Calendar className="w-5 h-5 text-red-400" />
      default:
        return <Activity className="w-5 h-5 text-white/60" />
    }
  }

  const getActivityLabel = (type: string) => {
    const labels: Record<string, string> = {
      deposit: 'Deposited',
      withdraw: 'Withdrew',
      harvest: 'Harvested',
      schedule: 'Scheduled Auto-Harvest',
      cancel: 'Cancelled Schedule',
    }
    return labels[type] || type
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'pending':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'error':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      default:
        return 'bg-white/10 text-white/70'
    }
  }

  const getExplorerUrl = (hash: string) => {
    return network === 'mainnet'
      ? `https://flowscan.org/transaction/${hash}`
      : `https://testnet.flowscan.org/transaction/${hash}`
  }

  const displayedActivities = activities.slice(0, maxItems)

  return (
    <Card className="bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-3xl shadow-xl">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
              <Activity className="text-white" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">Recent Activity</h3>
              <p className="text-white/60 text-sm">Your last {maxItems} actions</p>
            </div>
          </div>
          <Badge className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-3 py-1">
            {activities.length} Total
          </Badge>
        </div>

        {displayedActivities.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
              <Activity className="text-white/30" size={32} />
            </div>
            <p className="text-white/60 text-sm">No activity yet</p>
            <p className="text-white/40 text-xs mt-1">
              Your transactions will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayedActivities.map((activity, index) => (
              <div key={activity.id}>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all group">
                  <div className="flex-shrink-0 mt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-white">
                        {getActivityLabel(activity.type)}
                      </span>
                      <Badge className={`${getStatusColor(activity.status)} text-xs`}>
                        {activity.status}
                      </Badge>
                    </div>
                    {activity.amount && (
                      <div className="text-white/80 font-mono text-sm mb-2">
                        {formatCurrency(activity.amount)}
                      </div>
                    )}
                    <div className="flex items-center gap-3 text-xs text-white/50">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDateTime(activity.timestamp)}
                      </div>
                      <a
                        href={getExplorerUrl(activity.hash)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:text-cyan-400 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        View
                      </a>
                    </div>
                  </div>
                </div>
                {index < displayedActivities.length - 1 && (
                  <Separator className="my-2 bg-white/5" />
                )}
              </div>
            ))}
          </div>
        )}

        {activities.length > maxItems && (
          <div className="mt-4 text-center">
            <button className="text-cyan-400 text-sm font-semibold hover:text-cyan-300 transition-colors">
              View All Activity ({activities.length})
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Mock data generator for demo
export function generateMockActivities(): ActivityItem[] {
  const types: ActivityItem['type'][] = ['deposit', 'withdraw', 'harvest', 'schedule', 'cancel']
  const statuses: ActivityItem['status'][] = ['success', 'success', 'success', 'pending']

  return Array.from({ length: 8 }, (_, i) => ({
    id: `activity-${i}`,
    type: types[Math.floor(Math.random() * types.length)],
    amount: ['deposit', 'withdraw', 'harvest'].includes(types[i % types.length])
      ? Math.random() * 10000
      : undefined,
    timestamp: Date.now() - i * 3600000, // Each item 1 hour apart
    hash: `0x${Math.random().toString(16).substr(2, 64)}`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
  }))
}
