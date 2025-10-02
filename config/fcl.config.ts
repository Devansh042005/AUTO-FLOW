import * as fcl from '@onflow/fcl'

// Flow blockchain configuration for AutoFlow
export const configureFCL = () => {
  const network = process.env.NEXT_PUBLIC_FLOW_NETWORK || 'testnet'
  const accessNode =
    process.env.NEXT_PUBLIC_FLOW_ACCESS_NODE ||
    'https://rest-testnet.onflow.org'
  const walletDiscovery =
    process.env.NEXT_PUBLIC_FLOW_WALLET_DISCOVERY ||
    'https://fcl-discovery.onflow.org/testnet/authn'

  fcl.config({
    'app.detail.title': 'AutoFlow',
    'app.detail.description':
      'A Cadence-based yield optimizer on Flow blockchain',
    'app.detail.icon': 'https://autoflow.example.com/icon.png', // TODO: Replace with actual icon URL
    'accessNode.api': accessNode,
    'discovery.wallet': walletDiscovery,
    'flow.network': network,
    // Contract addresses - Update these after deployment
    '0xAutoFlowVault':
      process.env.NEXT_PUBLIC_AUTOFLOW_VAULT_ADDRESS || '0xAUTOFLOWVAULT',
    '0xFlowActionRegistry':
      process.env.NEXT_PUBLIC_FLOW_ACTION_REGISTRY_ADDRESS ||
      '0xFLOWACTIONREGISTRY',
    '0xHarvestScheduler':
      process.env.NEXT_PUBLIC_HARVEST_SCHEDULER_ADDRESS ||
      '0xHARVESTSCHEDULER',
  })
}

// Contract import templates
export const CONTRACT_IMPORTS = {
  AutoFlowVault: `import AutoFlowVault from 0xAutoFlowVault`,
  FlowActionRegistry: `import FlowActionRegistry from 0xFlowActionRegistry`,
  HarvestScheduler: `import HarvestScheduler from 0xHarvestScheduler`,
  FungibleToken: `import FungibleToken from 0x9a0766d93b6608b7`, // Testnet address
  FlowToken: `import FlowToken from 0x0ae53cb6e3f42a79`, // Testnet address
}

// Storage paths
export const STORAGE_PATHS = {
  AutoFlowVault: {
    storage: '/storage/AutoFlowVault',
    public: '/public/AutoFlowVault',
    private: '/private/AutoFlowVault',
  },
  HarvestScheduler: {
    storage: '/storage/HarvestScheduler',
    public: '/public/HarvestScheduler',
    private: '/private/HarvestScheduler',
  },
  FlowActionRegistry: {
    storage: '/storage/FlowActionRegistry',
    public: '/public/FlowActionRegistry',
  },
}

// Transaction templates
export const TX_TEMPLATES = {
  setupVault: `
    ${CONTRACT_IMPORTS.AutoFlowVault}
    ${CONTRACT_IMPORTS.FungibleToken}

    transaction {
      prepare(signer: AuthAccount) {
        if signer.borrow<&AutoFlowVault.Vault>(from: AutoFlowVault.VaultStoragePath) != nil {
          return
        }

        let vault <- AutoFlowVault.createEmptyVault(owner: signer.address)
        signer.save(<-vault, to: AutoFlowVault.VaultStoragePath)

        signer.link<&AutoFlowVault.Vault{AutoFlowVault.VaultPublic}>(
          AutoFlowVault.VaultPublicPath,
          target: AutoFlowVault.VaultStoragePath
        )

        signer.link<&AutoFlowVault.Vault{AutoFlowVault.VaultPrivate}>(
          AutoFlowVault.VaultPrivatePath,
          target: AutoFlowVault.VaultStoragePath
        )
      }
    }
  `,

  deposit: `
    ${CONTRACT_IMPORTS.AutoFlowVault}
    ${CONTRACT_IMPORTS.FungibleToken}
    ${CONTRACT_IMPORTS.FlowToken}

    transaction(amount: UFix64) {
      let vaultRef: &AutoFlowVault.Vault{AutoFlowVault.VaultPublic}
      let tokenVault: @FungibleToken.Vault

      prepare(signer: AuthAccount) {
        self.vaultRef = signer.borrow<&AutoFlowVault.Vault{AutoFlowVault.VaultPublic}>(
          from: AutoFlowVault.VaultStoragePath
        ) ?? panic("Could not borrow vault reference")

        let flowVault = signer.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)
          ?? panic("Could not borrow FlowToken vault")

        self.tokenVault <- flowVault.withdraw(amount: amount)
      }

      execute {
        self.vaultRef.deposit(from: <-self.tokenVault)
      }
    }
  `,

  withdraw: `
    ${CONTRACT_IMPORTS.AutoFlowVault}
    ${CONTRACT_IMPORTS.FungibleToken}
    ${CONTRACT_IMPORTS.FlowToken}

    transaction(amount: UFix64) {
      let vaultRef: &AutoFlowVault.Vault{AutoFlowVault.VaultPrivate}
      let receiverRef: &{FungibleToken.Receiver}

      prepare(signer: AuthAccount) {
        self.vaultRef = signer.borrow<&AutoFlowVault.Vault{AutoFlowVault.VaultPrivate}>(
          from: AutoFlowVault.VaultStoragePath
        ) ?? panic("Could not borrow vault reference")

        self.receiverRef = signer.borrow<&{FungibleToken.Receiver}>(from: /storage/flowTokenVault)
          ?? panic("Could not borrow receiver reference")
      }

      execute {
        let tokens <- self.vaultRef.withdraw(amount: amount)
        self.receiverRef.deposit(from: <-tokens)
      }
    }
  `,

  harvest: `
    ${CONTRACT_IMPORTS.AutoFlowVault}

    transaction {
      let vaultRef: &AutoFlowVault.Vault{AutoFlowVault.VaultPrivate}

      prepare(signer: AuthAccount) {
        self.vaultRef = signer.borrow<&AutoFlowVault.Vault{AutoFlowVault.VaultPrivate}>(
          from: AutoFlowVault.VaultStoragePath
        ) ?? panic("Could not borrow vault reference")
      }

      execute {
        let profit = self.vaultRef.harvest()
        log(profit)
      }
    }
  `,

  setupScheduler: `
    ${CONTRACT_IMPORTS.HarvestScheduler}

    transaction {
      prepare(signer: AuthAccount) {
        if signer.borrow<&HarvestScheduler.Scheduler>(from: HarvestScheduler.SchedulerStoragePath) != nil {
          return
        }

        let scheduler <- HarvestScheduler.createScheduler(owner: signer.address)
        signer.save(<-scheduler, to: HarvestScheduler.SchedulerStoragePath)

        signer.link<&HarvestScheduler.Scheduler{HarvestScheduler.SchedulerPublic}>(
          HarvestScheduler.SchedulerPublicPath,
          target: HarvestScheduler.SchedulerStoragePath
        )

        signer.link<&HarvestScheduler.Scheduler{HarvestScheduler.SchedulerPrivate}>(
          HarvestScheduler.SchedulerPrivatePath,
          target: HarvestScheduler.SchedulerStoragePath
        )
      }
    }
  `,

  scheduleHarvest: `
    ${CONTRACT_IMPORTS.HarvestScheduler}

    transaction(vaultAddress: Address, interval: UFix64) {
      let schedulerRef: &HarvestScheduler.Scheduler{HarvestScheduler.SchedulerPrivate}

      prepare(signer: AuthAccount) {
        self.schedulerRef = signer.borrow<&HarvestScheduler.Scheduler{HarvestScheduler.SchedulerPrivate}>(
          from: HarvestScheduler.SchedulerStoragePath
        ) ?? panic("Could not borrow scheduler reference")
      }

      execute {
        self.schedulerRef.scheduleHarvest(vaultAddress: vaultAddress, interval: interval)
      }
    }
  `,
}

// Script templates
export const SCRIPT_TEMPLATES = {
  getVaultBalance: `
    ${CONTRACT_IMPORTS.AutoFlowVault}

    pub fun main(address: Address): UFix64 {
      let vaultCap = getAccount(address)
        .getCapability<&AutoFlowVault.Vault{AutoFlowVault.VaultPublic}>(AutoFlowVault.VaultPublicPath)
        .borrow()
        ?? panic("Could not borrow vault reference")

      return vaultCap.getBalance()
    }
  `,

  getVaultInfo: `
    ${CONTRACT_IMPORTS.AutoFlowVault}

    pub fun main(address: Address): {String: UFix64} {
      let vaultCap = getAccount(address)
        .getCapability<&AutoFlowVault.Vault{AutoFlowVault.VaultPublic}>(AutoFlowVault.VaultPublicPath)
        .borrow()
        ?? panic("Could not borrow vault reference")

      return {
        "balance": vaultCap.getBalance(),
        "totalEarned": vaultCap.getTotalEarned(),
        "lastHarvestTime": vaultCap.getLastHarvestTime()
      }
    }
  `,

  getTotalTVL: `
    ${CONTRACT_IMPORTS.AutoFlowVault}

    pub fun main(): UFix64 {
      return AutoFlowVault.getTotalValueLocked()
    }
  `,

  discoverActions: `
    ${CONTRACT_IMPORTS.FlowActionRegistry}

    pub fun main(registryAddress: Address): [{String: AnyStruct}] {
      let registryCap = getAccount(registryAddress)
        .getCapability<&FlowActionRegistry.Registry{FlowActionRegistry.RegistryPublic}>(
          FlowActionRegistry.RegistryPublicPath
        )
        .borrow()
        ?? panic("Could not borrow registry reference")

      return registryCap.discoverActions()
    }
  `,

  getScheduleInfo: `
    ${CONTRACT_IMPORTS.HarvestScheduler}

    pub fun main(schedulerAddress: Address, vaultAddress: Address): HarvestScheduler.ScheduleInfo? {
      let schedulerCap = getAccount(schedulerAddress)
        .getCapability<&HarvestScheduler.Scheduler{HarvestScheduler.SchedulerPublic}>(
          HarvestScheduler.SchedulerPublicPath
        )
        .borrow()
        ?? panic("Could not borrow scheduler reference")

      return schedulerCap.getSchedule(vaultAddress: vaultAddress)
    }
  `,
}
