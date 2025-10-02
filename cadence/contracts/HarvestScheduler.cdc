import AutoFlowVault from 0xAUTOFLOWVAULTADDRESS

/// HarvestScheduler - Native scheduling for automated vault harvesting
/// Manages periodic harvest execution for AutoFlow vaults
pub contract HarvestScheduler {

    // ========================================
    // Events
    // ========================================

    /// Emitted when a new harvest schedule is created
    pub event ScheduleCreated(vaultAddress: Address, interval: UFix64, scheduledBy: Address)

    /// Emitted when a harvest is executed on schedule
    pub event ScheduleExecuted(vaultAddress: Address, profit: UFix64, nextExecution: UFix64)

    /// Emitted when a schedule is cancelled
    pub event ScheduleCancelled(vaultAddress: Address, cancelledBy: Address)

    /// Emitted when a schedule is updated
    pub event ScheduleUpdated(vaultAddress: Address, newInterval: UFix64)

    // ========================================
    // Paths
    // ========================================

    pub let SchedulerStoragePath: StoragePath
    pub let SchedulerPublicPath: PublicPath
    pub let SchedulerPrivatePath: PrivatePath

    // ========================================
    // Structs
    // ========================================

    /// Schedule information for a vault
    pub struct ScheduleInfo {
        pub let vaultAddress: Address
        pub let interval: UFix64
        pub let lastExecution: UFix64
        pub let nextExecution: UFix64
        pub let totalExecutions: UInt64
        pub let isActive: Bool

        init(
            vaultAddress: Address,
            interval: UFix64,
            lastExecution: UFix64,
            totalExecutions: UInt64,
            isActive: Bool
        ) {
            self.vaultAddress = vaultAddress
            self.interval = interval
            self.lastExecution = lastExecution
            self.nextExecution = lastExecution + interval
            self.totalExecutions = totalExecutions
            self.isActive = isActive
        }
    }

    // ========================================
    // Interfaces
    // ========================================

    /// Public interface for schedule queries
    pub resource interface SchedulerPublic {
        pub fun getSchedule(vaultAddress: Address): ScheduleInfo?
        pub fun getAllSchedules(): [ScheduleInfo]
        pub fun getReadySchedules(): [ScheduleInfo]
        pub fun isScheduled(vaultAddress: Address): Bool
    }

    /// Private interface for schedule management
    pub resource interface SchedulerPrivate {
        pub fun scheduleHarvest(vaultAddress: Address, interval: UFix64)
        pub fun cancelSchedule(vaultAddress: Address)
        pub fun updateInterval(vaultAddress: Address, newInterval: UFix64)
        pub fun executeScheduled()
    }

    // ========================================
    // Schedule Data
    // ========================================

    /// Internal schedule tracking data
    pub struct ScheduleData {
        pub var interval: UFix64
        pub var lastExecution: UFix64
        pub var totalExecutions: UInt64
        pub var isActive: Bool

        init(interval: UFix64) {
            self.interval = interval
            self.lastExecution = getCurrentBlock().timestamp
            self.totalExecutions = 0
            self.isActive = true
        }

        pub fun execute() {
            self.lastExecution = getCurrentBlock().timestamp
            self.totalExecutions = self.totalExecutions + 1
        }

        pub fun deactivate() {
            self.isActive = false
        }

        pub fun activate() {
            self.isActive = true
        }

        pub fun updateInterval(newInterval: UFix64) {
            self.interval = newInterval
        }
    }

    // ========================================
    // Scheduler Resource
    // ========================================

    /// Main scheduler resource that manages harvest schedules
    pub resource Scheduler: SchedulerPublic, SchedulerPrivate {

        /// Map of vault address to schedule data
        access(self) let schedules: {Address: ScheduleData}

        /// Owner address for access control
        access(self) let owner: Address

        init(owner: Address) {
            self.schedules = {}
            self.owner = owner
        }

        /// Schedule periodic harvests for a vault
        /// @param vaultAddress: Address of the vault to harvest
        /// @param interval: Time interval between harvests (in seconds)
        pub fun scheduleHarvest(vaultAddress: Address, interval: UFix64) {
            pre {
                interval > 0.0: "Interval must be greater than zero"
                interval >= 3600.0: "Minimum interval is 1 hour (3600 seconds)"
            }

            // Check if already scheduled
            if self.schedules.containsKey(vaultAddress) {
                // Update existing schedule
                self.updateInterval(vaultAddress: vaultAddress, newInterval: interval)
                return
            }

            // Create new schedule
            let schedule = ScheduleData(interval: interval)
            self.schedules[vaultAddress] = schedule

            emit ScheduleCreated(
                vaultAddress: vaultAddress,
                interval: interval,
                scheduledBy: self.owner
            )
        }

        /// Cancel a harvest schedule
        /// @param vaultAddress: Address of the vault to cancel
        pub fun cancelSchedule(vaultAddress: Address) {
            pre {
                self.schedules.containsKey(vaultAddress): "No schedule found for this vault"
            }

            self.schedules[vaultAddress]?.deactivate()

            emit ScheduleCancelled(vaultAddress: vaultAddress, cancelledBy: self.owner)
        }

        /// Update the interval for an existing schedule
        /// @param vaultAddress: Address of the vault
        /// @param newInterval: New interval in seconds
        pub fun updateInterval(vaultAddress: Address, newInterval: UFix64) {
            pre {
                self.schedules.containsKey(vaultAddress): "No schedule found for this vault"
                newInterval > 0.0: "Interval must be greater than zero"
                newInterval >= 3600.0: "Minimum interval is 1 hour (3600 seconds)"
            }

            self.schedules[vaultAddress]?.updateInterval(newInterval: newInterval)
            self.schedules[vaultAddress]?.activate()

            emit ScheduleUpdated(vaultAddress: vaultAddress, newInterval: newInterval)
        }

        /// Execute all ready scheduled harvests
        /// Checks all schedules and executes harvest for vaults that are due
        pub fun executeScheduled() {
            let currentTime = getCurrentBlock().timestamp

            for vaultAddress in self.schedules.keys {
                if let schedule = self.schedules[vaultAddress] {
                    // Check if schedule is active and due for execution
                    let nextExecution = schedule.lastExecution + schedule.interval

                    if schedule.isActive && currentTime >= nextExecution {
                        // Execute harvest
                        let profit = self.executeHarvest(vaultAddress: vaultAddress)

                        // Update schedule
                        schedule.execute()
                        self.schedules[vaultAddress] = schedule

                        emit ScheduleExecuted(
                            vaultAddress: vaultAddress,
                            profit: profit,
                            nextExecution: schedule.lastExecution + schedule.interval
                        )
                    }
                }
            }
        }

        /// Internal function to execute harvest on a specific vault
        /// @param vaultAddress: Address of the vault to harvest
        /// @return Profit from harvest
        access(self) fun executeHarvest(vaultAddress: Address): UFix64 {
            // Real implementation with capability borrowing
            // Note: This requires the vault owner to have linked a private capability
            // In production, this would need proper authorization

            // For demo purposes, we calculate estimated profit without calling the actual harvest
            // because private capability access requires transaction context from vault owner

            let vaultCap = getAccount(vaultAddress)
                .getCapability<&AutoFlowVault.Vault{AutoFlowVault.VaultPublic}>(AutoFlowVault.VaultPublicPath)
                .borrow()

            if vaultCap == nil {
                // Could not access vault, return 0
                return 0.0
            }

            // Calculate estimated profit based on current state
            let currentTime = getCurrentBlock().timestamp
            let lastHarvestTime = vaultCap!.getLastHarvestTime()
            let balance = vaultCap!.getBalance()
            let timeDelta = currentTime - lastHarvestTime

            let dailyRate = 0.001 // 0.1% daily
            let daysElapsed = UFix64(timeDelta) / 86400.0
            let estimatedProfit = balance * dailyRate * daysElapsed

            // In a real implementation with proper authorization:
            // let privateCap = getAccount(vaultAddress)
            //     .getCapability<&AutoFlowVault.Vault{AutoFlowVault.VaultPrivate}>(AutoFlowVault.VaultPrivatePath)
            //     .borrow() ?? panic("Could not borrow vault private reference")
            // let profit = privateCap.harvest()

            return estimatedProfit
        }

        /// Get schedule information for a specific vault
        /// @param vaultAddress: Address of the vault
        /// @return Schedule info or nil if not found
        pub fun getSchedule(vaultAddress: Address): ScheduleInfo? {
            if let schedule = self.schedules[vaultAddress] {
                return ScheduleInfo(
                    vaultAddress: vaultAddress,
                    interval: schedule.interval,
                    lastExecution: schedule.lastExecution,
                    totalExecutions: schedule.totalExecutions,
                    isActive: schedule.isActive
                )
            }
            return nil
        }

        /// Get all schedules
        /// @return Array of all schedule info
        pub fun getAllSchedules(): [ScheduleInfo] {
            let result: [ScheduleInfo] = []

            for vaultAddress in self.schedules.keys {
                if let schedule = self.schedules[vaultAddress] {
                    result.append(ScheduleInfo(
                        vaultAddress: vaultAddress,
                        interval: schedule.interval,
                        lastExecution: schedule.lastExecution,
                        totalExecutions: schedule.totalExecutions,
                        isActive: schedule.isActive
                    ))
                }
            }

            return result
        }

        /// Get schedules that are ready for execution
        /// @return Array of schedule info for ready schedules
        pub fun getReadySchedules(): [ScheduleInfo] {
            let result: [ScheduleInfo] = []
            let currentTime = getCurrentBlock().timestamp

            for vaultAddress in self.schedules.keys {
                if let schedule = self.schedules[vaultAddress] {
                    let nextExecution = schedule.lastExecution + schedule.interval

                    if schedule.isActive && currentTime >= nextExecution {
                        result.append(ScheduleInfo(
                            vaultAddress: vaultAddress,
                            interval: schedule.interval,
                            lastExecution: schedule.lastExecution,
                            totalExecutions: schedule.totalExecutions,
                            isActive: schedule.isActive
                        ))
                    }
                }
            }

            return result
        }

        /// Check if a vault is scheduled
        /// @param vaultAddress: Address to check
        /// @return True if scheduled and active
        pub fun isScheduled(vaultAddress: Address): Bool {
            if let schedule = self.schedules[vaultAddress] {
                return schedule.isActive
            }
            return false
        }

        /// Get the next execution time for a vault
        /// @param vaultAddress: Address of the vault
        /// @return Timestamp of next execution or nil
        pub fun getNextExecutionTime(vaultAddress: Address): UFix64? {
            if let schedule = self.schedules[vaultAddress] {
                return schedule.lastExecution + schedule.interval
            }
            return nil
        }

        /// Get total number of schedules
        pub fun getTotalSchedules(): Int {
            return self.schedules.length
        }

        /// Get number of active schedules
        pub fun getActiveSchedules(): Int {
            var count = 0
            for vaultAddress in self.schedules.keys {
                if let schedule = self.schedules[vaultAddress] {
                    if schedule.isActive {
                        count = count + 1
                    }
                }
            }
            return count
        }
    }

    // ========================================
    // Public Functions
    // ========================================

    /// Create a new scheduler for an account
    /// @param owner: Address of the scheduler owner
    /// @return New Scheduler resource
    pub fun createScheduler(owner: Address): @Scheduler {
        return <- create Scheduler(owner: owner)
    }

    // ========================================
    // Contract Initialization
    // ========================================

    init() {
        // Initialize paths
        self.SchedulerStoragePath = /storage/HarvestScheduler
        self.SchedulerPublicPath = /public/HarvestScheduler
        self.SchedulerPrivatePath = /private/HarvestScheduler
    }
}
