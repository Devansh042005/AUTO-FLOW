'use client'

import { Button } from '@/components/ui/button'
import { usePlaceholderData } from '@/hooks/usePlaceholderData'
import {
  Sparkles,
  Zap,
  TrendingUp,
  Shield,
  Wallet,
  ArrowRight,
  CheckCircle2
} from 'lucide-react'

export default function Landing() {
  const { connectWallet } = usePlaceholderData()

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Auto-Compounding',
      description: 'Automated yield optimization that compounds your rewards 24/7',
      gradient: 'from-indigo-500 to-purple-600'
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'AI-Powered Actions',
      description: 'FLIP-338 enabled smart actions for intelligent portfolio management',
      gradient: 'from-purple-500 to-pink-600'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Secure & Audited',
      description: 'Built on Flow blockchain with Cadence resource-oriented security',
      gradient: 'from-cyan-500 to-teal-600'
    }
  ]

  const benefits = [
    'Maximize yields with automated compounding',
    'Gas-efficient scheduled transactions',
    'AI agent integration via FLIP-338',
    'Resource-oriented security with Cadence',
    'Real-time performance tracking',
    'No manual intervention required'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-cyan-500/10 blur-3xl" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        </div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-6 pt-24 pb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-block">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-sm font-medium backdrop-blur-sm">
                  <Sparkles className="w-4 h-4" />
                  The Future of DeFi Automation
                </span>
              </div>

              {/* Heading */}
              <div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
                  Automate Yields with{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">AutoFlow</span>
                </h1>
                <p className="text-xl md:text-2xl text-zinc-400 leading-relaxed">
                  The ultimate platform for automated yield optimization.
                  Maximize returns with AI-powered strategies on Flow blockchain.
                </p>
              </div>

              {/* Feature Pills */}
              <div className="flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-zinc-300 text-sm font-medium backdrop-blur-sm">
                  <Zap className="w-4 h-4 text-indigo-400" />
                  Auto-Compounding
                </span>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-zinc-300 text-sm font-medium backdrop-blur-sm">
                  <Shield className="w-4 h-4 text-purple-400" />
                  Secure & Audited
                </span>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-zinc-300 text-sm font-medium backdrop-blur-sm">
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                  AI-Powered
                </span>
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row items-start gap-4 pt-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-indigo-500 to-purple-700 hover:from-indigo-600 hover:to-purple-800 text-white font-semibold px-8 h-12 rounded-lg shadow-lg transition-all hover:scale-105 group"
                  onClick={connectWallet}
                >
                  <Wallet className="w-5 h-5 mr-2" />
                  Connect Wallet
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>

                <Button
                  size="lg"
                  className="bg-gradient-to-r from-indigo-500 to-purple-700 hover:from-indigo-600 hover:to-purple-800 text-white font-semibold px-8 h-12 rounded-lg shadow-lg transition-all hover:scale-105 group"
                  onClick={() => window.open('https://flow.com/docs', '_blank')}
                >
                  Learn More
                </Button>
              </div>
            </div>

            {/* Right side - Visual card */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/30 to-purple-500/30 rounded-3xl blur-2xl"></div>
              <div className="relative bg-zinc-900/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-8">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                        <Sparkles className="text-white" size={24} />
                      </div>
                      <div>
                        <p className="text-sm text-zinc-400">Total Value Locked</p>
                        <p className="text-2xl font-bold text-white">$2.4M+</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">Active Vaults</span>
                      <span className="font-semibold text-white">12</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">Average APY</span>
                      <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400">24.5%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">Total Users</span>
                      <span className="font-semibold text-white">1,200+</span>
                    </div>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-700 hover:from-indigo-600 hover:to-purple-800 text-white font-semibold h-12 rounded-lg transition-all">
                    View Dashboard
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Powerful Features
          </h2>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Everything you need for automated yield optimization on Flow
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <div
              key={i}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 from-indigo-500/20 to-purple-500/20 rounded-2xl blur-xl transition-opacity" />
              <div className="relative bg-zinc-900/50 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-zinc-400 leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="bg-zinc-900/50 backdrop-blur-xl rounded-3xl p-12 shadow-lg border border-white/10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
            Why Choose AutoFlow?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {benefits.map((benefit, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0" />
                <span className="text-lg text-zinc-300">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Built For Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="relative overflow-hidden rounded-3xl p-12 bg-gradient-to-br from-indigo-600 via-purple-600 to-cyan-600 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/50 to-purple-600/50 opacity-50" />
          <div className="relative text-center">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Built for Forte Hacks 🚀
            </h3>
            <p className="text-white text-lg max-w-3xl mx-auto leading-relaxed">
              AutoFlow leverages Flow blockchain's native capabilities including
              Cadence resource-oriented programming, FLIP-338 Actions for AI agent
              integration, and scheduled transactions for automated yield farming.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Footer */}
      {/* <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-white mb-2">33K+</p>
              <p className="text-zinc-400">Global Developers</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-white mb-2">5</p>
              <p className="text-zinc-400">Active Hackathons</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-white mb-2">$100K+</p>
              <p className="text-zinc-400">In Prizes</p>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  )
}