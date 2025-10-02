'use client'

import { Container, Box, Grid, Typography, Alert } from '@mui/material'
import VaultStats from '@/components/VaultStats'
import DepositForm from '@/components/DepositForm'
import WithdrawForm from '@/components/WithdrawForm'
import HarvestButton from '@/components/HarvestButton'
import SchedulerControls from '@/components/SchedulerControls'
import ActionsPanel from '@/components/ActionsPanel'
import PerformanceChart from '@/components/PerformanceChart'
import Landing from '@/components/Landing'
import { usePlaceholderData } from '@/hooks/usePlaceholderData'
import { Sparkles, Zap, TrendingUp, Info } from 'lucide-react'

export default function Home() {
  const { isConnected } = usePlaceholderData()

  // Show landing page if wallet is not connected
  if (!isConnected) {
    return <Landing />
  }

  // Show dashboard if wallet is connected
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Hero Section */}
      <Box className="mb-12 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-cyan-500/10 rounded-3xl blur-3xl" />
        <div className="relative bg-gradient-to-br from-zinc-900/90 to-black/90 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-cyan-500 flex items-center justify-center shadow-lg animate-pulse">
              <Sparkles className="text-white" size={32} />
            </div>
            <div className="flex-1">
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 bg-gradient-to-r from-white via-indigo-200 to-cyan-200 bg-clip-text text-transparent leading-tight animate-fade-in">
                AutoFlow Dashboard
              </h1>
              <p className="text-lg md:text-xl text-zinc-400 max-w-3xl leading-relaxed">
                Automated yield optimization on Flow blockchain with{' '}
                <span className="text-indigo-400 font-semibold">Cadence smart contracts</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-indigo-500/50 transition-all">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Zap className="text-white" size={20} />
              </div>
              <div>
                <div className="text-white font-bold">Auto-Compounding</div>
                <div className="text-zinc-500 text-sm">Maximize returns</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/50 transition-all">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                <TrendingUp className="text-white" size={20} />
              </div>
              <div>
                <div className="text-white font-bold">AI-Powered</div>
                <div className="text-zinc-500 text-sm">FLIP-338 Actions</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/50 transition-all">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center">
                <Sparkles className="text-white" size={20} />
              </div>
              <div>
                <div className="text-white font-bold">Flow Native</div>
                <div className="text-zinc-500 text-sm">Cadence powered</div>
              </div>
            </div>
          </div>

          {!isConnected && (
            <div className="mt-6 p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-start gap-3">
              <Info className="text-indigo-400 mt-0.5 flex-shrink-0" size={20} />
              <div>
                <div className="text-indigo-300 font-semibold mb-1">Connect Your Wallet</div>
                <div className="text-indigo-200/70 text-sm">
                  Connect your wallet to start managing your AutoFlow vault and earning yield
                </div>
              </div>
            </div>
          )}
        </div>
      </Box>

      {/* Stats Cards */}
      <Box className="mb-8" data-section="vaults">
        <VaultStats />
      </Box>

      {/* Main Content Grid */}
      <Grid container spacing={3}>
        {/* Left Column - Forms */}
        <Grid item xs={12} lg={4}>
          <Box className="flex flex-col gap-4">
            <DepositForm />
            <WithdrawForm />
          </Box>
        </Grid>

        {/* Middle Column - Chart & Harvest */}
        <Grid item xs={12} lg={5}>
          <Box className="flex flex-col gap-4">
            <PerformanceChart />
            <HarvestButton />
          </Box>
        </Grid>

        {/* Right Column - Scheduler & Actions */}
        <Grid item xs={12} lg={3}>
          <Box className="flex flex-col gap-4">
            <SchedulerControls />
          </Box>
        </Grid>
      </Grid>

      {/* Actions Panel - Full Width */}
      <Box className="mt-8" data-section="actions">
        <ActionsPanel />
      </Box>

      {/* Info Banner */}
      <Box
        className="mt-8 p-8 rounded-3xl relative overflow-hidden group"
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/50 to-purple-600/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-3">
            <Sparkles className="text-white" size={28} />
            <Typography
              variant="h6"
              sx={{ color: 'white', fontWeight: 700, fontSize: '1.5rem' }}
              className="font-heading"
            >
              Built for Forte Hacks 🚀
            </Typography>
          </div>
          <Typography variant="body1" sx={{ color: 'white', opacity: 0.95, lineHeight: 1.7 }}>
            AutoFlow leverages Flow blockchain's native capabilities including
            Cadence resource-oriented programming, FLIP-338 Actions for AI agent
            integration, and scheduled transactions for automated yield farming.
          </Typography>
        </div>
      </Box>
    </Container>
  )
}
