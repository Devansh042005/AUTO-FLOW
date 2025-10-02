import HarvestScheduler from 0xHARVESTSCHEDULERADDRESS

/// Script to get schedule information for a vault
pub fun main(schedulerAddress: Address, vaultAddress: Address): HarvestScheduler.ScheduleInfo? {
    let schedulerCap = getAccount(schedulerAddress)
        .getCapability<&HarvestScheduler.Scheduler{HarvestScheduler.SchedulerPublic}>(
            HarvestScheduler.SchedulerPublicPath
        )
        .borrow()
        ?? panic("Could not borrow scheduler reference")

    return schedulerCap.getSchedule(vaultAddress: vaultAddress)
}
