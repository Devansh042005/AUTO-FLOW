import HarvestScheduler from 0xHARVESTSCHEDULERADDRESS

/// Transaction to schedule periodic harvest for a vault
transaction(vaultAddress: Address, interval: UFix64) {
    let schedulerRef: &HarvestScheduler.Scheduler{HarvestScheduler.SchedulerPrivate}

    prepare(signer: AuthAccount) {
        // Borrow scheduler reference
        self.schedulerRef = signer.borrow<&HarvestScheduler.Scheduler{HarvestScheduler.SchedulerPrivate}>(
            from: HarvestScheduler.SchedulerStoragePath
        ) ?? panic("Could not borrow scheduler reference")
    }

    execute {
        // Schedule harvest
        self.schedulerRef.scheduleHarvest(vaultAddress: vaultAddress, interval: interval)

        log("Scheduled harvest for vault ".concat(vaultAddress.toString()))
    }
}
