import FungibleToken from 0x9a0766d93b6608b7
import FlowToken     from 0x7e60df042a9c0868


/// AutoFlowVault - A resource-oriented yield optimizer vault
/// Manages user deposits, withdrawals, and automated yield harvesting with fee distribution
pub contract AutoFlowVault {

    // ========================================
    // Events
    // ========================================

    /// Emitted when a new vault is initialized for a user
    pub event VaultInitialized(owner: Address)

    /// Emitted when funds are deposited into a vault
    pub event Deposited(user: Address, amount: UFix64)

    /// Emitted when funds are withdrawn from a vault
    pub event Withdrawn(user: Address, amount: UFix64)

    /// Emitted when harvest is executed
    pub event Harvested(caller: Address, profit: UFix64, fees: UFix64, reward: UFix64)

    // ========================================
    // Paths
    // ========================================

    pub let VaultStoragePath: StoragePath
    pub let VaultPublicPath: PublicPath
    pub let VaultPrivatePath: PrivatePath
    pub let AdminStoragePath: StoragePath

    // ========================================
    // Contract State
    // ========================================

    /// Address of the contract owner who receives performance fees
    access(self) var contractOwner: Address

    /// Total value locked across all vaults
    pub var totalValueLocked: UFix64

    /// Total fees collected by the protocol
    pub var totalFeesCollected: UFix64

    // ========================================
    // Interfaces
    // ========================================

    /// Public interface for vault operations
    pub resource interface VaultPublic {
        pub fun deposit(from: @FungibleToken.Vault)
        pub fun getBalance(): UFix64
        pub fun getLastHarvestTime(): UFix64
        pub fun getTotalEarned(): UFix64
    }

    /// Private interface for vault owner operations
    pub resource interface VaultPrivate {
        pub fun withdraw(amount: UFix64): @FungibleToken.Vault
        pub fun harvest(): UFix64
    }

    // ========================================
    // Vault Resource
    // ========================================

    /// Main vault resource that holds user funds and manages yield
    pub resource Vault: VaultPublic, VaultPrivate {

        /// USDC balance held in the vault
        access(self) var balance: UFix64

        /// Timestamp of the last harvest execution
        access(self) var lastHarvestTime: UFix64

        /// Total earnings accumulated over the vault's lifetime
        access(self) var totalEarned: UFix64

        /// Owner address for event tracking
        access(self) let owner: Address

        /// Internal vault for holding fungible tokens
        access(self) let vault: @FungibleToken.Vault

        init(owner: Address, initialVault: @FungibleToken.Vault) {
            self.balance = 0.0
            self.lastHarvestTime = getCurrentBlock().timestamp
            self.totalEarned = 0.0
            self.owner = owner
            self.vault <- initialVault
        }

        /// Deposit funds into the vault
        /// @param from: Fungible token vault to deposit from
        pub fun deposit(from: @FungibleToken.Vault) {
            let amount = from.balance
            self.vault.deposit(from: <-from)
            self.balance = self.balance + amount

            AutoFlowVault.totalValueLocked = AutoFlowVault.totalValueLocked + amount

            emit Deposited(user: self.owner, amount: amount)
        }

        /// Withdraw funds from the vault
        /// @param amount: Amount to withdraw
        /// @return Fungible token vault with withdrawn funds
        pub fun withdraw(amount: UFix64): @FungibleToken.Vault {
            pre {
                amount > 0.0: "Withdrawal amount must be greater than zero"
                amount <= self.balance: "Insufficient balance"
            }

            self.balance = self.balance - amount
            AutoFlowVault.totalValueLocked = AutoFlowVault.totalValueLocked - amount

            emit Withdrawn(user: self.owner, amount: amount)

            return <- self.vault.withdraw(amount: amount)
        }

        /// Execute harvest to calculate profit and distribute fees
        /// Distributes 10% performance fee to contract owner, 1% caller reward, compounds remaining
        /// @return Total profit harvested
        pub fun harvest(): UFix64 {
            let currentTime = getCurrentBlock().timestamp
            let timeDelta = currentTime - self.lastHarvestTime

            // Simulate yield calculation (0.1% APY per day as example)
            // In production, this would integrate with actual DeFi protocols
            let dailyRate = 0.001 // 0.1% daily
            let daysElapsed = UFix64(timeDelta) / 86400.0 // Convert seconds to days
            let profit = self.balance * dailyRate * daysElapsed

            if profit > 0.0 {
                // Calculate fees
                let performanceFee = profit * 0.10 // 10% to contract owner
                let callerReward = profit * 0.01 // 1% to caller
                let compoundAmount = profit - performanceFee - callerReward

                // Update vault state
                self.balance = self.balance + compoundAmount
                self.totalEarned = self.totalEarned + profit
                self.lastHarvestTime = currentTime

                // Update contract state
                AutoFlowVault.totalFeesCollected = AutoFlowVault.totalFeesCollected + performanceFee
                AutoFlowVault.totalValueLocked = AutoFlowVault.totalValueLocked + compoundAmount

                // Note: In production, you would transfer performanceFee and callerReward
                // to the respective addresses using capability-based transfers

                emit Harvested(
                    caller: self.owner,
                    profit: profit,
                    fees: performanceFee,
                    reward: callerReward
                )
            }

            return profit
        }

        /// Get current vault balance
        pub fun getBalance(): UFix64 {
            return self.balance
        }

        /// Get timestamp of last harvest
        pub fun getLastHarvestTime(): UFix64 {
            return self.lastHarvestTime
        }

        /// Get total earnings accumulated
        pub fun getTotalEarned(): UFix64 {
            return self.totalEarned
        }

        destroy() {
            destroy self.vault
        }
    }

    // ========================================
    // Admin Resource
    // ========================================

    /// Admin resource for managing contract settings
    pub resource Admin {

        /// Update the contract owner address
        pub fun updateContractOwner(newOwner: Address) {
            AutoFlowVault.contractOwner = newOwner
        }

        /// Withdraw collected fees (in production, would transfer to owner)
        pub fun withdrawFees(amount: UFix64): UFix64 {
            pre {
                amount <= AutoFlowVault.totalFeesCollected: "Insufficient fees available"
            }

            AutoFlowVault.totalFeesCollected = AutoFlowVault.totalFeesCollected - amount
            return amount
        }
    }

    // ========================================
    // Public Functions
    // ========================================

    /// Create a new empty vault for a user
    /// @param owner: Address of the vault owner
    /// @return New Vault resource
    pub fun createEmptyVault(owner: Address): @Vault {
        // Create an empty fungible token vault (using FlowToken as placeholder for USDC)
        let emptyVault <- FlowToken.createEmptyVault()

        let vault <- create Vault(owner: owner, initialVault: <-emptyVault)

        emit VaultInitialized(owner: owner)

        return <- vault
    }

    /// Get the contract owner address
    pub fun getContractOwner(): Address {
        return self.contractOwner
    }

    /// Get total value locked in the protocol
    pub fun getTotalValueLocked(): UFix64 {
        return self.totalValueLocked
    }

    /// Get total fees collected
    pub fun getTotalFeesCollected(): UFix64 {
        return self.totalFeesCollected
    }

    // ========================================
    // Contract Initialization
    // ========================================

    init() {
        // Initialize paths
        self.VaultStoragePath = /storage/AutoFlowVault
        self.VaultPublicPath = /public/AutoFlowVault
        self.VaultPrivatePath = /private/AutoFlowVault
        self.AdminStoragePath = /storage/AutoFlowVaultAdmin

        // Initialize state
        self.contractOwner = self.account.address
        self.totalValueLocked = 0.0
        self.totalFeesCollected = 0.0

        // Create and save Admin resource
        let admin <- create Admin()
        self.account.save(<-admin, to: self.AdminStoragePath)
    }
}
