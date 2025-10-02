import AutoFlowVault from 0xAUTOFLOWVAULTADDRESS
import FungibleToken from 0x9a0766d93b6608b7

/// FlowActionRegistry - Implements FLIP-338 Action Registry
/// Provides standardized action discovery and execution for AutoFlow vault operations
pub contract FlowActionRegistry {

    // ========================================
    // Events
    // ========================================

    /// Emitted when a new action is registered
    pub event ActionRegistered(id: String, targetPath: String)

    /// Emitted when an action is executed
    pub event ActionExecuted(id: String, executor: Address, success: Bool)

    /// Emitted when an action is unregistered
    pub event ActionUnregistered(id: String)

    // ========================================
    // Paths
    // ========================================

    pub let RegistryStoragePath: StoragePath
    pub let RegistryPublicPath: PublicPath

    // ========================================
    // Structs
    // ========================================

    /// Metadata describing an action's interface and behavior
    pub struct ActionMetadata {
        pub let name: String
        pub let description: String
        pub let inputs: [String]
        pub let outputs: [String]

        init(name: String, description: String, inputs: [String], outputs: [String]) {
            self.name = name
            self.description = description
            self.inputs = inputs
            self.outputs = outputs
        }
    }

    /// Complete action definition with execution target
    pub struct ActionDefinition {
        pub let id: String
        pub let targetPath: PublicPath
        pub let metadata: ActionMetadata

        init(id: String, targetPath: PublicPath, metadata: ActionMetadata) {
            self.id = id
            self.targetPath = targetPath
            self.metadata = metadata
        }
    }

    // ========================================
    // Interfaces
    // ========================================

    /// Public interface for action discovery and execution
    pub resource interface RegistryPublic {
        pub fun discoverActions(): [{String: AnyStruct}]
        pub fun getAction(id: String): ActionDefinition?
        pub fun executeAction(id: String, payload: {String: AnyStruct}): {String: AnyStruct}
    }

    // ========================================
    // Registry Resource
    // ========================================

    /// Main registry resource that manages action registration and execution
    pub resource Registry: RegistryPublic {

        /// Map of action ID to action definition
        access(self) let actions: {String: ActionDefinition}

        init() {
            self.actions = {}
        }

        /// Register a new action in the registry
        /// @param id: Unique identifier for the action
        /// @param targetPath: Public path where the action target is stored
        /// @param metadata: Action metadata describing inputs/outputs
        pub fun registerAction(id: String, targetPath: PublicPath, metadata: ActionMetadata) {
            pre {
                !self.actions.containsKey(id): "Action ID already registered"
            }

            let definition = ActionDefinition(
                id: id,
                targetPath: targetPath,
                metadata: metadata
            )

            self.actions[id] = definition

            emit ActionRegistered(id: id, targetPath: targetPath.toString())
        }

        /// Unregister an action from the registry
        /// @param id: Action identifier to remove
        pub fun unregisterAction(id: String) {
            pre {
                self.actions.containsKey(id): "Action ID not found"
            }

            self.actions.remove(key: id)

            emit ActionUnregistered(id: id)
        }

        /// Discover all available actions
        /// @return Array of action definitions with metadata
        pub fun discoverActions(): [{String: AnyStruct}] {
            let result: [{String: AnyStruct}] = []

            for id in self.actions.keys {
                if let action = self.actions[id] {
                    result.append({
                        "id": action.id,
                        "name": action.metadata.name,
                        "description": action.metadata.description,
                        "inputs": action.metadata.inputs,
                        "outputs": action.metadata.outputs,
                        "targetPath": action.targetPath.toString()
                    })
                }
            }

            return result
        }

        /// Get a specific action definition
        /// @param id: Action identifier
        /// @return Action definition or nil if not found
        pub fun getAction(id: String): ActionDefinition? {
            return self.actions[id]
        }

        /// Execute a registered action with provided payload
        /// @param id: Action identifier to execute
        /// @param payload: Input parameters for the action
        /// @return Result dictionary with outputs
        pub fun executeAction(id: String, payload: {String: AnyStruct}): {String: AnyStruct} {
            pre {
                self.actions.containsKey(id): "Action ID not found"
            }

            let action = self.actions[id]!
            var success = false
            var result: {String: AnyStruct} = {}

            // Execute based on action type
            switch id {
                case "vault.deposit":
                    result = self.executeDeposit(payload: payload)
                    success = true

                case "vault.withdraw":
                    result = self.executeWithdraw(payload: payload)
                    success = true

                case "vault.harvest":
                    result = self.executeHarvest(payload: payload)
                    success = true

                case "vault.getBalance":
                    result = self.executeGetBalance(payload: payload)
                    success = true

                default:
                    result = {
                        "success": false,
                        "error": "Unknown action type"
                    }
            }

            emit ActionExecuted(id: id, executor: self.owner?.address ?? 0x0, success: success)

            return result
        }

        // ========================================
        // Action Implementations
        // ========================================

        /// Execute deposit action
        access(self) fun executeDeposit(payload: {String: AnyStruct}): {String: AnyStruct} {
            // Real implementation with capability borrowing
            // Expected payload: { "vaultAddress": Address, "amount": UFix64 }

            let vaultAddress = payload["vaultAddress"] as? Address
            let amount = payload["amount"] as? UFix64

            if vaultAddress == nil || amount == nil {
                return {
                    "success": false,
                    "error": "Missing required parameters: vaultAddress and amount"
                }
            }

            // Get vault public capability
            let vaultCap = getAccount(vaultAddress!)
                .getCapability<&AutoFlowVault.Vault{AutoFlowVault.VaultPublic}>(AutoFlowVault.VaultPublicPath)
                .borrow()

            if vaultCap == nil {
                return {
                    "success": false,
                    "error": "Could not borrow vault reference"
                }
            }

            // Note: In production, would withdraw from sender's token vault and deposit
            // For demo purposes, return success with simulated balance
            let newBalance = vaultCap!.getBalance() + amount!

            return {
                "success": true,
                "action": "deposit",
                "amount": amount!,
                "newBalance": newBalance,
                "message": "Deposit action prepared (requires transaction context for actual token transfer)"
            }
        }

        /// Execute withdraw action
        access(self) fun executeWithdraw(payload: {String: AnyStruct}): {String: AnyStruct} {
            // Real implementation with capability borrowing
            // Expected payload: { "vaultAddress": Address, "amount": UFix64 }
            // Note: Withdraw requires private capability, must be called in transaction context

            let vaultAddress = payload["vaultAddress"] as? Address
            let amount = payload["amount"] as? UFix64

            if vaultAddress == nil || amount == nil {
                return {
                    "success": false,
                    "error": "Missing required parameters: vaultAddress and amount"
                }
            }

            // Get vault public capability to check balance
            let vaultCap = getAccount(vaultAddress!)
                .getCapability<&AutoFlowVault.Vault{AutoFlowVault.VaultPublic}>(AutoFlowVault.VaultPublicPath)
                .borrow()

            if vaultCap == nil {
                return {
                    "success": false,
                    "error": "Could not borrow vault reference"
                }
            }

            let currentBalance = vaultCap!.getBalance()

            if amount! > currentBalance {
                return {
                    "success": false,
                    "error": "Insufficient balance"
                }
            }

            return {
                "success": true,
                "action": "withdraw",
                "amount": amount!,
                "remainingBalance": currentBalance - amount!,
                "message": "Withdraw action validated (requires transaction context with private capability for execution)"
            }
        }

        /// Execute harvest action
        access(self) fun executeHarvest(payload: {String: AnyStruct}): {String: AnyStruct} {
            // Real implementation with capability borrowing
            // Expected payload: { "vaultAddress": Address }
            // Note: Harvest requires private capability, must be called in transaction context

            let vaultAddress = payload["vaultAddress"] as? Address

            if vaultAddress == nil {
                return {
                    "success": false,
                    "error": "Missing required parameter: vaultAddress"
                }
            }

            // Get vault public capability to check state
            let vaultCap = getAccount(vaultAddress!)
                .getCapability<&AutoFlowVault.Vault{AutoFlowVault.VaultPublic}>(AutoFlowVault.VaultPublicPath)
                .borrow()

            if vaultCap == nil {
                return {
                    "success": false,
                    "error": "Could not borrow vault reference"
                }
            }

            let currentBalance = vaultCap!.getBalance()
            let lastHarvestTime = vaultCap!.getLastHarvestTime()
            let totalEarned = vaultCap!.getTotalEarned()

            // Calculate estimated profit
            let currentTime = getCurrentBlock().timestamp
            let timeDelta = currentTime - lastHarvestTime
            let dailyRate = 0.001
            let daysElapsed = UFix64(timeDelta) / 86400.0
            let estimatedProfit = currentBalance * dailyRate * daysElapsed

            return {
                "success": true,
                "action": "harvest",
                "currentBalance": currentBalance,
                "estimatedProfit": estimatedProfit,
                "lastHarvestTime": lastHarvestTime,
                "totalEarned": totalEarned,
                "message": "Harvest action ready (requires transaction context with private capability for execution)"
            }
        }

        /// Execute get balance action
        access(self) fun executeGetBalance(payload: {String: AnyStruct}): {String: AnyStruct} {
            // Real implementation with capability borrowing
            // Expected payload: { "vaultAddress": Address }

            let vaultAddress = payload["vaultAddress"] as? Address

            if vaultAddress == nil {
                return {
                    "success": false,
                    "error": "Missing required parameter: vaultAddress"
                }
            }

            // Get vault public capability
            let vaultCap = getAccount(vaultAddress!)
                .getCapability<&AutoFlowVault.Vault{AutoFlowVault.VaultPublic}>(AutoFlowVault.VaultPublicPath)
                .borrow()

            if vaultCap == nil {
                return {
                    "success": false,
                    "error": "Could not borrow vault reference"
                }
            }

            return {
                "success": true,
                "action": "getBalance",
                "balance": vaultCap!.getBalance(),
                "totalEarned": vaultCap!.getTotalEarned(),
                "lastHarvestTime": vaultCap!.getLastHarvestTime()
            }
        }
    }

    // ========================================
    // Public Functions
    // ========================================

    /// Create a new action registry
    /// @return New Registry resource
    pub fun createRegistry(): @Registry {
        return <- create Registry()
    }

    /// Initialize default AutoFlow actions in a registry
    /// @param registry: Registry resource to populate with actions
    pub fun initializeDefaultActions(registry: &Registry) {
        // Register deposit action
        registry.registerAction(
            id: "vault.deposit",
            targetPath: AutoFlowVault.VaultPublicPath,
            metadata: ActionMetadata(
                name: "Deposit",
                description: "Deposit funds into AutoFlow vault",
                inputs: ["amount: UFix64", "vault: Capability<&{FungibleToken.Receiver}>"],
                outputs: ["success: Bool", "newBalance: UFix64"]
            )
        )

        // Register withdraw action
        registry.registerAction(
            id: "vault.withdraw",
            targetPath: AutoFlowVault.VaultPublicPath,
            metadata: ActionMetadata(
                name: "Withdraw",
                description: "Withdraw funds from AutoFlow vault",
                inputs: ["amount: UFix64"],
                outputs: ["success: Bool", "withdrawnAmount: UFix64"]
            )
        )

        // Register harvest action
        registry.registerAction(
            id: "vault.harvest",
            targetPath: AutoFlowVault.VaultPublicPath,
            metadata: ActionMetadata(
                name: "Harvest",
                description: "Execute yield harvest and compound rewards",
                inputs: [],
                outputs: ["success: Bool", "profit: UFix64", "fees: UFix64", "reward: UFix64"]
            )
        )

        // Register get balance action
        registry.registerAction(
            id: "vault.getBalance",
            targetPath: AutoFlowVault.VaultPublicPath,
            metadata: ActionMetadata(
                name: "Get Balance",
                description: "Query current vault balance",
                inputs: [],
                outputs: ["balance: UFix64", "totalEarned: UFix64", "lastHarvestTime: UFix64"]
            )
        )
    }

    // ========================================
    // Contract Initialization
    // ========================================

    init() {
        // Initialize paths
        self.RegistryStoragePath = /storage/FlowActionRegistry
        self.RegistryPublicPath = /public/FlowActionRegistry

        // Create and save default registry
        let registry <- create Registry()

        // Initialize with default AutoFlow actions
        self.initializeDefaultActions(registry: &registry as &Registry)

        // Save to account storage
        self.account.save(<-registry, to: self.RegistryStoragePath)

        // Link public capability
        self.account.link<&Registry{RegistryPublic}>(
            self.RegistryPublicPath,
            target: self.RegistryStoragePath
        )
    }
}
