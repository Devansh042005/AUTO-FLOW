import HarvestScheduler from 0xHARVESTSCHEDULERADDRESS

/// Transaction to setup harvest scheduler in user account
transaction {
    prepare(signer: AuthAccount) {
        // Check if scheduler already exists
        if signer.borrow<&HarvestScheduler.Scheduler>(from: HarvestScheduler.SchedulerStoragePath) != nil {
            return
        }

        // Create new scheduler
        let scheduler <- HarvestScheduler.createScheduler(owner: signer.address)

        // Save scheduler to storage
        signer.save(<-scheduler, to: HarvestScheduler.SchedulerStoragePath)

        // Link public capability
        signer.link<&HarvestScheduler.Scheduler{HarvestScheduler.SchedulerPublic}>(
            HarvestScheduler.SchedulerPublicPath,
            target: HarvestScheduler.SchedulerStoragePath
        )

        // Link private capability
        signer.link<&HarvestScheduler.Scheduler{HarvestScheduler.SchedulerPrivate}>(
            HarvestScheduler.SchedulerPrivatePath,
            target: HarvestScheduler.SchedulerStoragePath
        )

        log("Harvest scheduler setup complete")
    }
}
