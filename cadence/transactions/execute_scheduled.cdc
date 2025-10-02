import HarvestScheduler from 0xHARVESTSCHEDULERADDRESS

/// Transaction to execute all ready scheduled harvests
transaction {
    let schedulerRef: &HarvestScheduler.Scheduler{HarvestScheduler.SchedulerPrivate}

    prepare(signer: AuthAccount) {
        // Borrow scheduler reference
        self.schedulerRef = signer.borrow<&HarvestScheduler.Scheduler{HarvestScheduler.SchedulerPrivate}>(
            from: HarvestScheduler.SchedulerStoragePath
        ) ?? panic("Could not borrow scheduler reference")
    }

    execute {
        // Execute all ready schedules
        self.schedulerRef.executeScheduled()

        log("Executed all ready scheduled harvests")
    }
}
