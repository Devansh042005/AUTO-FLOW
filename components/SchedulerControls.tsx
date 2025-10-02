'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { Calendar, PlayCircle, StopCircle, Clock, Settings } from 'lucide-react'
import { usePlaceholderData } from '@/hooks/usePlaceholderData'
import { calculateTimeRemaining, formatDuration } from '@/utils/formatters'

export default function SchedulerControls() {
  const [interval, setInterval] = useState('3600')
  const [loading, setLoading] = useState(false)
  const { scheduleData } = usePlaceholderData()

  const handleSchedule = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      alert(`Harvest scheduled every ${formatDuration(parseInt(interval))}`)
    }, 2000)
  }

  const handleCancel = () => alert('Schedule cancelled')
  const handleExecute = () => alert('Executing scheduled harvests...')

  const progress = scheduleData.isActive
    ? ((Date.now() / 1000 - scheduleData.lastExecution) / scheduleData.interval) * 100
    : 0

  return (
    <Card className="bg-[#212537] backdrop-blur-xl border border-orange-700/20 shadow-lg rounded-2xl hover:shadow-orange-300/10 hover:border-orange-400/25 transition">
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-br from-orange-400 to-orange-700 shadow-lg">
              <Settings className="text-white w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-lg text-orange-300">Auto-Harvest</div>
              <div className="text-white/70 text-xs">Automated compounding</div>
            </div>
          </div>
          <Badge
            className={cn(
              "px-3 py-1.5 text-xs font-bold rounded-lg border",
              scheduleData.isActive
                ? "bg-gradient-to-r from-green-400 to-cyan-400 text-green-900 border-green-300/30"
                : "bg-white/10 text-white/70 border-slate-300/10"
            )}
          >
            {scheduleData.isActive && (
              <span className="w-2 h-2 rounded-full bg-white animate-pulse mr-2" />
            )}
            {scheduleData.isActive ? 'Active' : 'Inactive'}
          </Badge>
        </div>
        {/* Progress/Info */}
        {scheduleData.isActive && (
          <div className="p-5 rounded-xl bg-gradient-to-br from-orange-400/10 to-orange-700/10 border border-orange-300/20 mb-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-orange-400 to-orange-700 rounded-full" style={{ width: `${Math.min(progress, 100)}%` }} />
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-orange-300" />
              <span className="uppercase text-xs text-white/80 font-semibold">Next Execution</span>
            </div>
            <div className="font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-700 text-xl mb-2">
              {calculateTimeRemaining(scheduleData.lastExecution, scheduleData.interval)}
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <span className="text-xs text-white/70 font-semibold">Interval</span>
                <div className="font-bold text-white">{formatDuration(scheduleData.interval)}</div>
              </div>
              <div>
                <span className="text-xs text-white/70 font-semibold">Total Runs</span>
                <div className="font-bold text-white">{scheduleData.totalExecutions}</div>
              </div>
            </div>
          </div>
        )}
        {/* Schedule Controls */}
        <div className="space-y-2">
          <Label htmlFor="harvest-interval" className="text-white/80">Harvest Interval</Label>
          <Select value={interval} onValueChange={setInterval}>
            <SelectTrigger id="harvest-interval" className="bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="Select interval" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3600">Every 1 Hour</SelectItem>
              <SelectItem value="7200">Every 2 Hours</SelectItem>
              <SelectItem value="14400">Every 4 Hours</SelectItem>
              <SelectItem value="21600">Every 6 Hours</SelectItem>
              <SelectItem value="43200">Every 12 Hours</SelectItem>
              <SelectItem value="86400">Every 24 Hours</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          {scheduleData.isActive ? (
            <>
              <Button
                className="w-full bg-gradient-to-r from-orange-400 to-orange-700 text-white py-6 rounded-lg font-bold text-base shadow-lg hover:from-orange-500 hover:to-orange-800 transition-all"
                onClick={handleExecute}
              >
                <PlayCircle className="w-5 h-5 mr-2" />
                Execute Now
              </Button>
              <Button
                variant="outline"
                className="w-full border-2 border-red-400/30 text-red-400 font-bold py-6 rounded-lg text-base hover:border-red-500 hover:bg-red-700/5"
                onClick={handleCancel}
              >
                <StopCircle className="w-5 h-5 mr-2" />
                Cancel Schedule
              </Button>
            </>
          ) : (
            <Button
              className="w-full bg-gradient-to-r from-orange-400 to-orange-700 text-white py-6 rounded-lg font-bold text-base shadow-lg hover:from-orange-500 hover:to-orange-800 transition-all disabled:opacity-50"
              onClick={handleSchedule}
              disabled={loading}
            >
              <Calendar className="w-5 h-5 mr-2" />
              {loading ? 'Scheduling...' : 'Enable Auto-Harvest'}
            </Button>
          )}
        </div>
        <div className="mt-4 p-3 rounded-xl bg-indigo-400/10 border border-indigo-300/10">
          <span className="text-indigo-300 text-xs font-bold">ℹ️ Minimum interval: 1 hour</span>
        </div>
      </CardContent>
    </Card>
  )
}
