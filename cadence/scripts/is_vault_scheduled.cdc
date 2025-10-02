import HarvestScheduler from 0xHARVESTSCHEDULERADDRESS

/// Script to check if a vault is scheduled
pub fun main(schedulerAddress: Address, vaultAddress: Address): Bool {
    let schedulerCap = getAccount(schedulerAddress)
        .getCapability<&HarvestScheduler.Scheduler{HarvestScheduler.SchedulerPublic}>(
            HarvestScheduler.SchedulerPublicPath
        )
        .borrow()
        ?? panic("Could not borrow scheduler reference")

    return schedulerCap.isScheduled(vaultAddress: vaultAddress)
}
