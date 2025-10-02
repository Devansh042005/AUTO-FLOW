'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import {
  Puzzle,
  PlusCircle,
  MinusCircle,
  Leaf,
  Banknote,
  Bot,
  Sparkles,
} from 'lucide-react'
import { usePlaceholderData } from '@/hooks/usePlaceholderData'
import { getStatusColor } from '@/utils/formatters'

const actionIconsConfig = {
  'vault.deposit': {
    icon: <PlusCircle size={20} />,
    gradient: 'from-indigo-500 to-purple-700',
    color: 'indigo-500',
  },
  'vault.withdraw': {
    icon: <MinusCircle size={20} />,
    gradient: 'from-pink-400 to-red-400',
    color: 'pink-400',
  },
  'vault.harvest': {
    icon: <Leaf size={20} />,
    gradient: 'from-green-400 to-teal-400',
    color: 'green-400',
  },
  'vault.getBalance': {
    icon: <Banknote size={20} />,
    gradient: 'from-blue-400 to-cyan-400',
    color: 'blue-400',
  },
}

export default function ActionsPanel() {
  const { actionsData } = usePlaceholderData()
  return (
    <div className="relative">
      <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 rounded-2xl blur-xl opacity-20" />
      <Card className="relative bg-gradient-to-br from-zinc-900 to-black border border-zinc-800/80 rounded-2xl shadow-2xl transition hover:shadow-indigo-500/20">
        <CardContent className="pt-6">
          <div className="flex flex-row items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-700 shadow-lg shadow-indigo-500/50 animate-pulse">
                <Puzzle size={28} strokeWidth={2.5} className="text-white" />
              </div>
              <div>
                <h2 className="font-heading font-bold text-2xl text-white mb-1">
                  Flow Actions (FLIP-338)
                </h2>
                <span className="text-sm text-zinc-400 flex items-center gap-2">
                  <Sparkles size={14} className="text-indigo-400" />
                  AI-discoverable vault operations
                </span>
              </div>
            </div>
            <Badge className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 border border-indigo-500/30 px-4 py-2 text-sm font-bold">
              {actionsData.length} Actions Available
            </Badge>
          </div>

          <div className="space-y-4">
            {actionsData.map((action, index) => {
              const config =
                actionIconsConfig[action.id] ||
                actionIconsConfig['vault.getBalance']
              return (
                <div
                  key={action.id}
                  className="group p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 hover:border-indigo-500/50 hover:bg-zinc-900/80 transition-all duration-300"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg bg-gradient-to-br ${config.gradient} group-hover:scale-110 transition-transform duration-300`}
                    >
                      {config.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold text-white text-lg font-heading">
                          {action.name}
                        </span>
                        <Badge variant={getStatusColor(action.status)}>
                          {action.status}
                        </Badge>
                      </div>
                      <span className="text-sm text-zinc-400 block mb-3">
                        {action.description}
                      </span>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wide">
                          Parameters:
                        </span>
                        {action.inputs.length > 0 ? (
                          action.inputs.map((input, i) => (
                            <Badge
                              key={i}
                              className="bg-zinc-800/80 text-zinc-300 font-mono text-xs border border-zinc-700"
                            >
                              {input}
                            </Badge>
                          ))
                        ) : (
                          <Badge className="bg-zinc-800/50 text-zinc-500 border border-zinc-700/50 text-xs">
                            No parameters
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button
                      className={`bg-gradient-to-r ${config.gradient} text-white font-bold rounded-xl px-6 py-2 min-w-[100px] shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300`}
                      onClick={() => alert(`Executing action: ${action.id}`)}
                    >
                      Execute
                    </Button>
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-800/50 border border-zinc-700/50">
                    <span className="text-xs text-zinc-400 uppercase font-bold mb-2 block">
                      Returns:
                    </span>
                    <div className="flex flex-wrap gap-2 text-xs font-mono text-zinc-300">
                      {action.outputs.map((output, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-zinc-900 rounded border border-zinc-700"
                        >
                          {output}
                        </span>
                      ))}
                    </div>
                  </div>
                  {index < actionsData.length - 1 && (
                    <Separator className="mt-4 bg-zinc-800/30" />
                  )}
                </div>
              )
            })}
          </div>

          <div className="mt-8 p-5 rounded-2xl bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border border-indigo-800/50 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <Bot size={20} className="text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="uppercase text-sm font-bold tracking-wide text-indigo-400">
                    AI Integration Ready
                  </span>
                  <Badge className="bg-green-500/20 text-green-400 border border-green-500/30 text-xs">
                    Active
                  </Badge>
                </div>
                <span className="text-sm text-zinc-300 leading-relaxed">
                  These actions can be discovered and executed by AI agents via
                  the FLIP-338 registry interface, enabling autonomous DeFi
                  operations.
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
