import Test
import BlockchainHelpers
import "HarvestScheduler"
import "AutoFlowVault"

// Test suite for HarvestScheduler contract
pub fun setup() {
    let err1 = Test.deployContract(
        name: "AutoFlowVault",
        path: "../contracts/AutoFlowVault.cdc",
        arguments: []
    )

    let err2 = Test.deployContract(
        name: "HarvestScheduler",
        path: "../contracts/HarvestScheduler.cdc",
        arguments: []
    )

    Test.expect(err1, Test.beNil())
    Test.expect(err2, Test.beNil())
}

// Test: Create scheduler
pub fun testCreateScheduler() {
    let account = Test.createAccount()

    let txResult = executeTransaction(
        "../transactions/setup_scheduler.cdc",
        [],
        account
    )

    Test.expect(txResult, Test.beSucceeded())
}

// Test: Schedule harvest
pub fun testScheduleHarvest() {
    let account = Test.createAccount()
    let vaultAccount = Test.createAccount()

    // Setup scheduler and vault
    executeTransaction("../transactions/setup_scheduler.cdc", [], account)
    executeTransaction("../transactions/setup_vault.cdc", [], vaultAccount)
    executeTransaction("../transactions/deposit.cdc", [1000.0], vaultAccount)

    // Schedule harvest with 1 hour interval
    let scheduleResult = executeTransaction(
        "../transactions/schedule_harvest.cdc",
        [vaultAccount.address, 3600.0],
        account
    )

    Test.expect(scheduleResult, Test.beSucceeded())

    // Verify schedule exists
    let isScheduled = executeScript(
        "../scripts/is_vault_scheduled.cdc",
        [account.address, vaultAccount.address]
    )

    Test.assertEqual(true, isScheduled as! Bool)
}

// Test: Execute scheduled harvest
pub fun testExecuteScheduled() {
    let account = Test.createAccount()
    let vaultAccount = Test.createAccount()

    // Setup
    executeTransaction("../transactions/setup_scheduler.cdc", [], account)
    executeTransaction("../transactions/setup_vault.cdc", [], vaultAccount)
    executeTransaction("../transactions/deposit.cdc", [1000.0], vaultAccount)
    executeTransaction(
        "../transactions/schedule_harvest.cdc",
        [vaultAccount.address, 3600.0],
        account
    )

    // Advance time by 2 hours
    Test.commitBlock()

    // Execute scheduled harvests
    let executeResult = executeTransaction(
        "../transactions/execute_scheduled.cdc",
        [],
        account
    )

    Test.expect(executeResult, Test.beSucceeded())
}

// Test: Cancel schedule
pub fun testCancelSchedule() {
    let account = Test.createAccount()
    let vaultAccount = Test.createAccount()

    // Setup and schedule
    executeTransaction("../transactions/setup_scheduler.cdc", [], account)
    executeTransaction("../transactions/setup_vault.cdc", [], vaultAccount)
    executeTransaction(
        "../transactions/schedule_harvest.cdc",
        [vaultAccount.address, 3600.0],
        account
    )

    // Cancel schedule
    let cancelResult = executeTransaction(
        "../transactions/cancel_schedule.cdc",
        [vaultAccount.address],
        account
    )

    Test.expect(cancelResult, Test.beSucceeded())

    // Verify schedule is inactive
    let isScheduled = executeScript(
        "../scripts/is_vault_scheduled.cdc",
        [account.address, vaultAccount.address]
    )

    Test.assertEqual(false, isScheduled as! Bool)
}

// Test: Update interval
pub fun testUpdateInterval() {
    let account = Test.createAccount()
    let vaultAccount = Test.createAccount()

    // Setup and schedule
    executeTransaction("../transactions/setup_scheduler.cdc", [], account)
    executeTransaction("../transactions/setup_vault.cdc", [], vaultAccount)
    executeTransaction(
        "../transactions/schedule_harvest.cdc",
        [vaultAccount.address, 3600.0],
        account
    )

    // Update interval to 2 hours
    let updateResult = executeTransaction(
        "../transactions/update_interval.cdc",
        [vaultAccount.address, 7200.0],
        account
    )

    Test.expect(updateResult, Test.beSucceeded())

    // Verify new interval
    let scheduleInfo = executeScript(
        "../scripts/get_schedule_info.cdc",
        [account.address, vaultAccount.address]
    )

    let interval = (scheduleInfo as! {String: UFix64})["interval"]!
    Test.assertEqual(7200.0, interval)
}

// Test: Get ready schedules
pub fun testGetReadySchedules() {
    let account = Test.createAccount()
    let vaultAccount1 = Test.createAccount()
    let vaultAccount2 = Test.createAccount()

    // Setup scheduler
    executeTransaction("../transactions/setup_scheduler.cdc", [], account)

    // Setup vaults
    executeTransaction("../transactions/setup_vault.cdc", [], vaultAccount1)
    executeTransaction("../transactions/setup_vault.cdc", [], vaultAccount2)
    executeTransaction("../transactions/deposit.cdc", [1000.0], vaultAccount1)
    executeTransaction("../transactions/deposit.cdc", [500.0], vaultAccount2)

    // Schedule both with 1 hour interval
    executeTransaction(
        "../transactions/schedule_harvest.cdc",
        [vaultAccount1.address, 3600.0],
        account
    )
    executeTransaction(
        "../transactions/schedule_harvest.cdc",
        [vaultAccount2.address, 3600.0],
        account
    )

    // Advance time
    Test.commitBlock()

    // Get ready schedules
    let readySchedules = executeScript(
        "../scripts/get_ready_schedules.cdc",
        [account.address]
    )

    let schedules = readySchedules as! [AnyStruct]
    Test.assert(schedules.length >= 2, message: "Should have ready schedules")
}

// Test: Minimum interval validation
pub fun testMinimumIntervalValidation() {
    let account = Test.createAccount()
    let vaultAccount = Test.createAccount()

    executeTransaction("../transactions/setup_scheduler.cdc", [], account)
    executeTransaction("../transactions/setup_vault.cdc", [], vaultAccount)

    // Try to schedule with less than 1 hour interval (should fail)
    let scheduleResult = executeTransaction(
        "../transactions/schedule_harvest.cdc",
        [vaultAccount.address, 1800.0], // 30 minutes
        account
    )

    Test.expect(scheduleResult, Test.beFailed())
}
