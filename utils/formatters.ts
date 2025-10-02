// Utility functions for formatting values in the UI

/**
 * Format a number as currency (USD)
 */
export const formatCurrency = (value: number, decimals: number = 2): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

/**
 * Format a number as a percentage
 */
export const formatPercentage = (
  value: number,
  decimals: number = 2
): string => {
  return `${value.toFixed(decimals)}%`
}

/**
 * Format a large number with K, M, B suffixes
 */
export const formatCompactNumber = (value: number): string => {
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(2)}B`
  }
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(2)}K`
  }
  return formatCurrency(value)
}

/**
 * Format a timestamp to a readable date
 */
export const formatDate = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/**
 * Format a timestamp to a readable date and time
 */
export const formatDateTime = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Format seconds to human-readable duration
 */
export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  if (hours > 24) {
    const days = Math.floor(hours / 24)
    return `${days} day${days !== 1 ? 's' : ''}`
  }

  if (hours > 0) {
    return `${hours} hour${hours !== 1 ? 's' : ''}`
  }

  return `${minutes} minute${minutes !== 1 ? 's' : ''}`
}

/**
 * Format Flow address (shortened)
 */
export const formatAddress = (address: string): string => {
  if (address.length < 12) return address
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

/**
 * Format a number with commas
 */
export const formatNumber = (value: number, decimals: number = 2): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

/**
 * Calculate time remaining until next execution
 */
export const calculateTimeRemaining = (
  lastExecution: number,
  interval: number
): string => {
  const nextExecution = lastExecution + interval
  const now = Math.floor(Date.now() / 1000)
  const remaining = nextExecution - now

  if (remaining <= 0) {
    return 'Ready now'
  }

  return `in ${formatDuration(remaining)}`
}

/**
 * Get status color based on value
 */
export const getStatusColor = (
  status: 'active' | 'pending' | 'completed' | 'error'
): 'default' | 'secondary' | 'destructive' | 'outline' => {
  switch (status) {
    case 'active':
      return 'default'
    case 'pending':
      return 'secondary'
    case 'completed':
      return 'outline'
    case 'error':
      return 'destructive'
    default:
      return 'outline'
  }
}
