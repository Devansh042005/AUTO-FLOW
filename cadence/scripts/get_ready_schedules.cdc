import HarvestScheduler from 0xHARVESTSCHEDULERADDRESS

/// Script to get all schedules ready for execution
pub fun main(schedulerAddress: Address): [HarvestScheduler.ScheduleInfo] {
    let schedulerCap = getAccount(schedulerAddress)
        .getCapability<&HarvestScheduler.Scheduler{HarvestScheduler.SchedulerPublic}>(
            HarvestScheduler.SchedulerPublicPath
        )
        .borrow()
        ?? panic("Could not borrow scheduler reference")

    return schedulerCap.getReadySchedules()
}
