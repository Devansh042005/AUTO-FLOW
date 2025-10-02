# AutoFlow Deployment & Demo Guide

Complete guide for deploying AutoFlow to Flow testnet and running demo flows for the Forte Hacks hackathon.

## Prerequisites

1. **Flow CLI** - Install from https://docs.onflow.org/flow-cli/install/
2. **Node.js 18+** and npm
3. **Flow Testnet Account** - Create at https://testnet-faucet.onflow.org/
4. **Testnet FLOW tokens** - Get from the faucet

## Step 1: Environment Setup

### 1.1 Clone and Install Dependencies

```bash
cd AUTO-FLOW
npm install
```

### 1.2 Configure Environment Variables

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your configuration
# You'll update contract addresses after deployment
```

### 1.3 Configure Flow CLI

Create `flow.json` in the project root:

```json
{
  "networks": {
    "testnet": "access.devnet.nodes.onflow.org:9000"
  },
  "accounts": {
    "testnet-account": {
      "address": "YOUR_TESTNET_ADDRESS",
      "key": "YOUR_PRIVATE_KEY"
    }
  },
  "deployments": {
    "testnet": {
      "testnet-account": [
        "AutoFlowVault",
        "FlowActionRegistry",
        "HarvestScheduler"
      ]
    }
  },
  "contracts": {
    "AutoFlowVault": "./cadence/contracts/AutoFlowVault.cdc",
    "FlowActionRegistry": "./cadence/contracts/FlowActionRegistry.cdc",
    "HarvestScheduler": "./cadence/contracts/HarvestScheduler.cdc"
  }
}
```

## Step 2: Deploy Contracts to Flow Testnet

### 2.1 Update Contract Import Addresses

Before deploying, update placeholder addresses in contracts:

**FlowActionRegistry.cdc** - Line 1:
```cadence
import AutoFlowVault from YOUR_TESTNET_ADDRESS
```

**HarvestScheduler.cdc** - Line 1:
```cadence
import AutoFlowVault from YOUR_TESTNET_ADDRESS
```

### 2.2 Deploy Contracts (in order)

```bash
# Deploy AutoFlowVault first
flow accounts add-contract AutoFlowVault \
  ./cadence/contracts/AutoFlowVault.cdc \
  --network testnet \
  --signer testnet-account

# Update FlowActionRegistry.cdc with deployed AutoFlowVault address
# Then deploy FlowActionRegistry
flow accounts add-contract FlowActionRegistry \
  ./cadence/contracts/FlowActionRegistry.cdc \
  --network testnet \
  --signer testnet-account

# Deploy HarvestScheduler
flow accounts add-contract HarvestScheduler \
  ./cadence/contracts/HarvestScheduler.cdc \
  --network testnet \
  --signer testnet-account
```

### 2.3 Verify Deployments

```bash
# Check deployed contracts
flow accounts get YOUR_TESTNET_ADDRESS --network testnet
```

### 2.4 Update Environment Variables

Update `.env` with deployed contract addresses:

```env
NEXT_PUBLIC_AUTOFLOW_VAULT_ADDRESS=0xYOUR_DEPLOYED_ADDRESS
NEXT_PUBLIC_FLOW_ACTION_REGISTRY_ADDRESS=0xYOUR_DEPLOYED_ADDRESS
NEXT_PUBLIC_HARVEST_SCHEDULER_ADDRESS=0xYOUR_DEPLOYED_ADDRESS
```

## Step 3: Run Cadence Tests

```bash
# Run AutoFlowVault tests
flow test ./cadence/tests/AutoFlowVault_test.cdc --network testnet

# Run HarvestScheduler tests
flow test ./cadence/tests/HarvestScheduler_test.cdc --network testnet
```

## Step 4: Demo Flow - Vault Operations

### 4.1 Setup Vault

```bash
# Create vault for your account
flow transactions send ./cadence/transactions/setup_vault.cdc \
  --network testnet \
  --signer testnet-account
```

**Expected Events:**
- `AutoFlowVault.VaultInitialized(owner: YOUR_ADDRESS)`

### 4.2 Deposit Funds

```bash
# Deposit 1000.0 FLOW tokens (acting as USDC)
flow transactions send ./cadence/transactions/deposit.cdc \
  --arg UFix64:1000.0 \
  --network testnet \
  --signer testnet-account
```

**Expected Events:**
- `AutoFlowVault.Deposited(user: YOUR_ADDRESS, amount: 1000.0)`

### 4.3 Check Vault Balance

```bash
# Query vault balance
flow scripts execute ./cadence/scripts/get_vault_info.cdc \
  --arg Address:YOUR_ADDRESS \
  --network testnet
```

**Expected Output:**
```json
{
  "balance": 1000.0,
  "totalEarned": 0.0,
  "lastHarvestTime": 1234567890
}
```

### 4.4 Execute Harvest (after waiting ~1 day or use emulator time manipulation)

```bash
# Execute harvest to generate yield
flow transactions send ./cadence/transactions/harvest.cdc \
  --network testnet \
  --signer testnet-account
```

**Expected Events:**
- `AutoFlowVault.Harvested(caller: YOUR_ADDRESS, profit: ~1.0, fees: ~0.1, reward: ~0.01)`

**Yield Calculation:**
- Daily rate: 0.1% (0.001)
- For 1000.0 balance after 1 day: 1000 * 0.001 = 1.0 profit
- Performance fee: 1.0 * 0.10 = 0.1
- Caller reward: 1.0 * 0.01 = 0.01
- Compounded: 1.0 - 0.1 - 0.01 = 0.89

### 4.5 Withdraw Funds

```bash
# Withdraw 500.0 tokens
flow transactions send ./cadence/transactions/withdraw.cdc \
  --arg UFix64:500.0 \
  --network testnet \
  --signer testnet-account
```

**Expected Events:**
- `AutoFlowVault.Withdrawn(user: YOUR_ADDRESS, amount: 500.0)`

## Step 5: Demo Flow - Scheduled Harvests

### 5.1 Setup Scheduler

```bash
# Create scheduler for your account
flow transactions send ./cadence/transactions/setup_scheduler.cdc \
  --network testnet \
  --signer testnet-account
```

### 5.2 Schedule Periodic Harvest

```bash
# Schedule harvest every 1 hour (3600 seconds)
flow transactions send ./cadence/transactions/schedule_harvest.cdc \
  --arg Address:YOUR_ADDRESS \
  --arg UFix64:3600.0 \
  --network testnet \
  --signer testnet-account
```

**Expected Events:**
- `HarvestScheduler.ScheduleCreated(vaultAddress: YOUR_ADDRESS, interval: 3600.0, scheduledBy: YOUR_ADDRESS)`

### 5.3 Check Schedule Status

```bash
# Query schedule information
flow scripts execute ./cadence/scripts/get_schedule_info.cdc \
  --arg Address:YOUR_ADDRESS \
  --arg Address:YOUR_ADDRESS \
  --network testnet
```

**Expected Output:**
```json
{
  "vaultAddress": "0xYOUR_ADDRESS",
  "interval": 3600.0,
  "lastExecution": 1234567890,
  "nextExecution": 1234571490,
  "totalExecutions": 0,
  "isActive": true
}
```

### 5.4 Execute Scheduled Harvests

```bash
# After 1+ hour has passed, execute ready schedules
flow transactions send ./cadence/transactions/execute_scheduled.cdc \
  --network testnet \
  --signer testnet-account
```

**Expected Events:**
- `HarvestScheduler.ScheduleExecuted(vaultAddress: YOUR_ADDRESS, profit: ~1.0, nextExecution: TIMESTAMP)`

### 5.5 Check Ready Schedules

```bash
# Query all schedules ready for execution
flow scripts execute ./cadence/scripts/get_ready_schedules.cdc \
  --arg Address:YOUR_ADDRESS \
  --network testnet
```

## Step 6: Demo Flow - FLIP-338 Actions (AI Agent Integration)

### 6.1 Discover Available Actions

```bash
# Query all registered Flow Actions
flow scripts execute ./cadence/scripts/discover_actions.cdc \
  --arg Address:YOUR_ADDRESS \
  --network testnet
```

**Expected Output:**
```json
[
  {
    "id": "vault.deposit",
    "name": "Deposit",
    "description": "Deposit funds into AutoFlow vault",
    "inputs": ["amount: UFix64", "vault: Capability<&{FungibleToken.Receiver}>"],
    "outputs": ["success: Bool", "newBalance: UFix64"],
    "targetPath": "/public/AutoFlowVault"
  },
  {
    "id": "vault.withdraw",
    "name": "Withdraw",
    "description": "Withdraw funds from AutoFlow vault",
    "inputs": ["amount: UFix64"],
    "outputs": ["success: Bool", "withdrawnAmount: UFix64"],
    "targetPath": "/public/AutoFlowVault"
  },
  {
    "id": "vault.harvest",
    "name": "Harvest",
    "description": "Execute yield harvest and compound rewards",
    "inputs": [],
    "outputs": ["success: Bool", "profit: UFix64", "fees: UFix64", "reward: UFix64"],
    "targetPath": "/public/AutoFlowVault"
  },
  {
    "id": "vault.getBalance",
    "name": "Get Balance",
    "description": "Query current vault balance",
    "inputs": [],
    "outputs": ["balance: UFix64", "totalEarned: UFix64", "lastHarvestTime: UFix64"],
    "targetPath": "/public/AutoFlowVault"
  }
]
```

### 6.2 Execute Action - Get Balance

```bash
# Execute getBalance action via Action Registry
flow scripts execute ./cadence/scripts/execute_action.cdc \
  --arg Address:YOUR_REGISTRY_ADDRESS \
  --arg String:vault.getBalance \
  --arg '{String:AnyStruct}:{"vaultAddress":"YOUR_ADDRESS"}' \
  --network testnet
```

**Expected Output:**
```json
{
  "success": true,
  "action": "getBalance",
  "balance": 500.89,
  "totalEarned": 1.0,
  "lastHarvestTime": 1234567890
}
```

### 6.3 Execute Action - Harvest

```bash
# Execute harvest action via Action Registry
flow scripts execute ./cadence/scripts/execute_action.cdc \
  --arg Address:YOUR_REGISTRY_ADDRESS \
  --arg String:vault.harvest \
  --arg '{String:AnyStruct}:{"vaultAddress":"YOUR_ADDRESS"}' \
  --network testnet
```

**Expected Output:**
```json
{
  "success": true,
  "action": "harvest",
  "currentBalance": 500.89,
  "estimatedProfit": 0.50089,
  "lastHarvestTime": 1234567890,
  "totalEarned": 1.0,
  "message": "Harvest action ready (requires transaction context with private capability for execution)"
}
```

## Step 7: Frontend Development Setup

### 7.1 Start Development Server

```bash
npm run dev
```

Navigate to `http://localhost:3000`

### 7.2 Key Integration Points

**Initialize FCL in `app/layout.tsx`:**

```typescript
import { configureFCL } from '@/config/fcl.config'

export default function RootLayout({ children }) {
  useEffect(() => {
    configureFCL()
  }, [])

  return <html>{children}</html>
}
```

**Use FCL Hooks in Components:**

```typescript
import * as fcl from '@onflow/fcl'
import { TX_TEMPLATES, SCRIPT_TEMPLATES } from '@/config/fcl.config'

// Execute transaction
const deposit = async (amount: string) => {
  const txId = await fcl.mutate({
    cadence: TX_TEMPLATES.deposit,
    args: (arg, t) => [arg(amount, t.UFix64)],
  })

  const transaction = await fcl.tx(txId).onceSealed()
  return transaction
}

// Execute script
const getBalance = async (address: string) => {
  const balance = await fcl.query({
    cadence: SCRIPT_TEMPLATES.getVaultBalance,
    args: (arg, t) => [arg(address, t.Address)],
  })

  return balance
}
```

## Step 8: Verify Event Logs

### 8.1 Check Transaction Events

```bash
# Get transaction details
flow transactions get TRANSACTION_ID --network testnet
```

### 8.2 Monitor Events

```bash
# Watch for AutoFlowVault events
flow events get A.YOUR_ADDRESS.AutoFlowVault.Harvested \
  --network testnet \
  --start BLOCK_HEIGHT \
  --end latest
```

## Step 9: Demo Walkthrough for Judges

### Complete Demo Script (5 minutes)

1. **Setup** (1 min)
   - Show deployed contracts on Flow testnet
   - Display `.env` with contract addresses
   - Open frontend at `localhost:3000`

2. **Vault Operations** (2 min)
   - Connect wallet via FCL
   - Setup vault (show `VaultInitialized` event)
   - Deposit 1000 FLOW (show `Deposited` event)
   - Display balance in UI
   - Execute harvest (show `Harvested` event with profit breakdown)
   - Withdraw 500 FLOW (show `Withdrawn` event)

3. **Scheduled Harvests** (1 min)
   - Setup scheduler
   - Schedule periodic harvest (1 hour interval)
   - Show schedule status in UI
   - Execute scheduled harvest (demonstrate automation)

4. **AI Agent Integration - FLIP-338** (1 min)
   - Discover available actions via registry
   - Show action metadata (inputs/outputs)
   - Execute `vault.getBalance` action
   - Demonstrate how AI agents can interact with vault

5. **Architecture Highlights** (30 sec)
   - Resource-oriented programming (Vault resource)
   - Capability-based security (Public/Private paths)
   - Native scheduling (HarvestScheduler)
   - Standardized actions (FLIP-338 registry)

## Troubleshooting

### Common Issues

**Issue: "Could not borrow vault reference"**
- Ensure vault is setup: Run `setup_vault.cdc` transaction
- Check public capability is linked at `/public/AutoFlowVault`

**Issue: "Insufficient balance"**
- Verify account has FLOW tokens for gas + deposits
- Use testnet faucet: https://testnet-faucet.onflow.org/

**Issue: "Action not found"**
- Verify FlowActionRegistry is deployed
- Check registry initialization in contract `init()`

**Issue: Schedule not executing**
- Verify interval has passed (minimum 1 hour)
- Check schedule is active: Run `get_schedule_info.cdc`

### Reset Environment

```bash
# Remove all contracts (start fresh)
flow accounts remove-contract AutoFlowVault --network testnet --signer testnet-account
flow accounts remove-contract FlowActionRegistry --network testnet --signer testnet-account
flow accounts remove-contract HarvestScheduler --network testnet --signer testnet-account
```

## Additional Resources

- **Flow Documentation**: https://docs.onflow.org/
- **FCL Documentation**: https://github.com/onflow/fcl-js
- **Cadence Language**: https://docs.onflow.org/cadence/
- **FLIP-338 Spec**: https://github.com/onflow/flips/pull/338
- **Flow Testnet Explorer**: https://testnet.flowscan.org/

## Hackathon Submission Checklist

- [ ] All 3 contracts deployed to Flow testnet
- [ ] Contract addresses updated in `.env`
- [ ] Demo video showing full flow (setup → deposit → harvest → schedule)
- [ ] Screenshots of event logs from Flow testnet
- [ ] Frontend running with FCL integration
- [ ] Action registry discoverable by AI agents
- [ ] README.md with project overview
- [ ] DEPLOYMENT.md with setup instructions
- [ ] GitHub repository public and accessible
