import toast from 'react-hot-toast'

export type NotificationType = 'success' | 'error' | 'loading' | 'info'

interface NotificationOptions {
  duration?: number
  position?: 'top-center' | 'top-right' | 'bottom-center' | 'bottom-right'
}

export const notify = {
  success: (message: string, options?: NotificationOptions) => {
    return toast.success(message, {
      duration: options?.duration || 4000,
      position: options?.position || 'top-right',
      style: {
        background: '#10b981',
        color: '#fff',
        fontWeight: 600,
        borderRadius: '12px',
        padding: '16px',
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#10b981',
      },
    })
  },

  error: (message: string, options?: NotificationOptions) => {
    return toast.error(message, {
      duration: options?.duration || 5000,
      position: options?.position || 'top-right',
      style: {
        background: '#ef4444',
        color: '#fff',
        fontWeight: 600,
        borderRadius: '12px',
        padding: '16px',
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#ef4444',
      },
    })
  },

  loading: (message: string, options?: NotificationOptions) => {
    return toast.loading(message, {
      position: options?.position || 'top-right',
      style: {
        background: '#6366f1',
        color: '#fff',
        fontWeight: 600,
        borderRadius: '12px',
        padding: '16px',
      },
    })
  },

  info: (message: string, options?: NotificationOptions) => {
    return toast(message, {
      duration: options?.duration || 4000,
      position: options?.position || 'top-right',
      icon: 'ℹ️',
      style: {
        background: '#3b82f6',
        color: '#fff',
        fontWeight: 600,
        borderRadius: '12px',
        padding: '16px',
      },
    })
  },

  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string
      success: string
      error: string
    },
    options?: NotificationOptions
  ) => {
    return toast.promise(
      promise,
      {
        loading: messages.loading,
        success: messages.success,
        error: messages.error,
      },
      {
        position: options?.position || 'top-right',
        style: {
          fontWeight: 600,
          borderRadius: '12px',
          padding: '16px',
        },
      }
    )
  },

  dismiss: (toastId?: string) => {
    if (toastId) {
      toast.dismiss(toastId)
    } else {
      toast.dismiss()
    }
  },

  // Custom transaction notification with hash link
  transaction: (
    hash: string,
    status: 'pending' | 'success' | 'error',
    network: 'testnet' | 'mainnet' = 'testnet'
  ) => {
    const explorerUrl = network === 'mainnet'
      ? `https://flowscan.org/transaction/${hash}`
      : `https://testnet.flowscan.org/transaction/${hash}`

    if (status === 'pending') {
      return toast.loading(
        <div>
          <div className="font-bold mb-1">Transaction Submitted</div>
          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs underline opacity-90 hover:opacity-100"
          >
            View on FlowScan →
          </a>
        </div>,
        {
          position: 'bottom-right',
        }
      )
    } else if (status === 'success') {
      return toast.success(
        <div>
          <div className="font-bold mb-1">Transaction Confirmed</div>
          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs underline opacity-90 hover:opacity-100"
          >
            View on FlowScan →
          </a>
        </div>,
        {
          position: 'bottom-right',
          duration: 6000,
        }
      )
    } else {
      return toast.error(
        <div>
          <div className="font-bold mb-1">Transaction Failed</div>
          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs underline opacity-90 hover:opacity-100"
          >
            View on FlowScan →
          </a>
        </div>,
        {
          position: 'bottom-right',
          duration: 8000,
        }
      )
    }
  },
}
