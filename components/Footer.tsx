'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import {
  Github,
  Twitter,
  FileText,
  Heart,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative bg-gradient-to-b from-zinc-900 via-black to-zinc-950 border-t border-zinc-800/50 backdrop-blur-md mt-auto overflow-hidden">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-transparent pointer-events-none" />

      {/* Main Footer Content */}
      <div className="relative max-w-7xl mx-auto px-5 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-cyan-500 shadow-lg flex items-center justify-center animate-pulse">
                <span className="font-extrabold text-white text-xl">AF</span>
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-2xl bg-gradient-to-br from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  AutoFlow
                </h3>
                <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30 text-xs mt-1">
                  Flow Yield Optimizer
                </Badge>
              </div>
            </div>
            <p className="text-zinc-400 leading-relaxed mb-6 max-w-md">
              A Cadence-based yield optimizer on Flow blockchain for automated
              DeFi strategies. Built with cutting-edge technology for maximum
              returns.
            </p>
            <div className="flex gap-2">
              <Button
                size="icon"
                variant="ghost"
                aria-label="GitHub"
                className="w-10 h-10 rounded-lg bg-zinc-800/50 border border-zinc-700/50 text-zinc-400 hover:text-white hover:bg-indigo-600/80 hover:border-indigo-500/50 transition-all"
              >
                <Github size={18} />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                aria-label="Twitter"
                className="w-10 h-10 rounded-lg bg-zinc-800/50 border border-zinc-700/50 text-zinc-400 hover:text-white hover:bg-purple-600/80 hover:border-purple-500/50 transition-all"
              >
                <Twitter size={18} />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                aria-label="Documentation"
                className="w-10 h-10 rounded-lg bg-zinc-800/50 border border-zinc-700/50 text-zinc-400 hover:text-white hover:bg-cyan-600/80 hover:border-cyan-500/50 transition-all"
              >
                <FileText size={18} />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading uppercase text-zinc-300 font-bold mb-4 text-sm tracking-widest flex items-center gap-2">
              <Sparkles size={14} className="text-indigo-400" />
              Product
            </h4>
            <nav className="flex flex-col gap-3">
              {['Dashboard', 'Vaults', 'Actions', 'Analytics'].map((label) => (
                <Link
                  key={label}
                  href="#"
                  className="group flex items-center gap-2 text-zinc-400 font-semibold text-sm hover:text-indigo-400 transition"
                >
                  <span>{label}</span>
                  <ArrowUpRight
                    size={14}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </Link>
              ))}
            </nav>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-heading uppercase text-zinc-300 font-bold mb-4 text-sm tracking-widest flex items-center gap-2">
              <FileText size={14} className="text-purple-400" />
              Resources
            </h4>
            <nav className="flex flex-col gap-3">
              {[
                'Documentation',
                'GitHub',
                'Cadence Contracts',
                'Flow Testnet',
              ].map((label) => (
                <Link
                  key={label}
                  href="#"
                  className="group flex items-center gap-2 text-zinc-400 font-semibold text-sm hover:text-purple-400 transition"
                >
                  <span>{label}</span>
                  <ArrowUpRight
                    size={14}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-zinc-800/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-zinc-500 font-medium text-sm">
              <span>© {currentYear} AutoFlow.</span>
              <span className="flex items-center gap-1">
                Built with <Heart size={14} className="text-pink-500 fill-pink-500 animate-pulse" /> for
              </span>
              <Badge className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 border-indigo-500/30 font-bold">
                Forte Hacks on Flow
              </Badge>
            </div>
            <div className="flex gap-6 text-zinc-500 font-semibold text-sm">
              <Link href="#" className="hover:text-indigo-400 transition">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-purple-400 transition">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
