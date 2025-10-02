# AutoFlow

A Cadence-based yield optimizer on Flow blockchain.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Material-UI v5
- **State Management**: React Query (TanStack Query)
- **Charts**: Recharts
- **Blockchain**: Flow (@onflow/fcl, @onflow/types)
- **Code Quality**: ESLint, Prettier, Husky

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
├── hooks/                 # Custom React hooks
├── config/                # Configuration files
├── public/                # Static assets
├── styles/                # Global styles
└── utils/                 # Utility functions
```

## Setup Instructions

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd AUTO-FLOW
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and configure your Flow network settings:
   - `FLOW_NETWORK`: `mainnet`, `testnet`, or `emulator`
   - `NEXT_PUBLIC_FLOW_ACCESS_NODE`: Flow API endpoint
   - `NEXT_PUBLIC_FLOW_WALLET_DISCOVERY`: Wallet discovery endpoint

4. **Initialize Husky**
   ```bash
   npm run prepare
   ```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

### Code Quality

- **Lint**: `npm run lint`
- **Format**: `npm run format`
- **Format Check**: `npm run format:check`

### Git Hooks

Pre-commit hooks are configured via Husky to:
- Run ESLint on staged files
- Format code with Prettier
- Ensure code quality before commits

## Flow Network Configuration

### Testnet (Default)
```env
FLOW_NETWORK=testnet
NEXT_PUBLIC_FLOW_ACCESS_NODE=https://rest-testnet.onflow.org
NEXT_PUBLIC_FLOW_WALLET_DISCOVERY=https://fcl-discovery.onflow.org/authn
```

### Mainnet
```env
FLOW_NETWORK=mainnet
NEXT_PUBLIC_FLOW_ACCESS_NODE=https://rest-mainnet.onflow.org
NEXT_PUBLIC_FLOW_WALLET_DISCOVERY=https://fcl-discovery.onflow.org/authn
```

### Local Emulator
```env
FLOW_NETWORK=emulator
NEXT_PUBLIC_FLOW_ACCESS_NODE=http://localhost:8888
NEXT_PUBLIC_FLOW_WALLET_DISCOVERY=http://localhost:8701/fcl/authn
```

## Next Steps

1. Implement Flow FCL configuration in `config/flow.ts`
2. Create React Query provider setup
3. Build UI components with Material-UI and Tailwind
4. Develop Cadence smart contracts
5. Implement yield optimization logic

## License

[Your License Here]
