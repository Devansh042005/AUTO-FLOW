'use client'

import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { Box } from '@mui/material'
import darkTheme from '@/config/darkTheme'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { PrivyProvider } from '@privy-io/react-auth'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className={inter.className}>
        <PrivyProvider
          appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || 'cmg9f15co00c7la0ct488b41v'}
          config={{
            appearance: {
              theme: 'dark',
              accentColor: '#6366F1',
              logo: 'https://autoflow.example.com/logo.png',
            },
            loginMethods: ['email', 'wallet', 'google', 'twitter'],
            embeddedWallets: {
              createOnLogin: 'users-without-wallets',
            },
          }}
        >
          <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <Box
              sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'background.default',
              }}
            >
              <Header />
              <Box component="main" sx={{ flexGrow: 1 }}>
                {children}
              </Box>
              <Footer />
            </Box>
          </ThemeProvider>
        </PrivyProvider>
      </body>
    </html>
  )
}
