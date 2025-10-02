import Test
import BlockchainHelpers
import "AutoFlowVault"
import "FungibleToken"
import "FlowToken"

// Test suite for AutoFlowVault contract
pub fun setup() {
    let err = Test.deployContract(
        name: "AutoFlowVault",
        path: "../contracts/AutoFlowVault.cdc",
        arguments: []
    )

    Test.expect(err, Test.beNil())
}

// Test: Create empty vault
pub fun testCreateEmptyVault() {
    let account = Test.createAccount()

    let txResult = executeTransaction(
        "../transactions/setup_vault.cdc",
        [],
        account
    )

    Test.expect(txResult, Test.beSucceeded())
}

// Test: Deposit into vault
pub fun testDeposit() {
    let account = Test.createAccount()

    // Setup vault
    executeTransaction(
        "../transactions/setup_vault.cdc",
        [],
        account
    )

    // Deposit funds
    let depositResult = executeTransaction(
        "../transactions/deposit.cdc",
        [100.0],
        account
    )

    Test.expect(depositResult, Test.beSucceeded())

    // Check balance
    let balance = executeScript(
        "../scripts/get_vault_balance.cdc",
        [account.address]
    )

    Test.assertEqual(100.0, balance as! UFix64)
}

// Test: Withdraw from vault
pub fun testWithdraw() {
    let account = Test.createAccount()

    // Setup and deposit
    executeTransaction("../transactions/setup_vault.cdc", [], account)
    executeTransaction("../transactions/deposit.cdc", [100.0], account)

    // Withdraw
    let withdrawResult = executeTransaction(
        "../transactions/withdraw.cdc",
        [50.0],
        account
    )

    Test.expect(withdrawResult, Test.beSucceeded())

    // Check remaining balance
    let balance = executeScript(
        "../scripts/get_vault_balance.cdc",
        [account.address]
    )

    Test.assertEqual(50.0, balance as! UFix64)
}

// Test: Harvest yield
pub fun testHarvest() {
    let account = Test.createAccount()

    // Setup and deposit
    executeTransaction("../transactions/setup_vault.cdc", [], account)
    executeTransaction("../transactions/deposit.cdc", [1000.0], account)

    // Advance time by 1 day (86400 seconds)
    Test.commitBlock()

    // Execute harvest
    let harvestResult = executeTransaction(
        "../transactions/harvest.cdc",
        [],
        account
    )

    Test.expect(harvestResult, Test.beSucceeded())

    // Check that totalEarned increased
    let info = executeScript(
        "../scripts/get_vault_info.cdc",
        [account.address]
    )

    let totalEarned = (info as! {String: UFix64})["totalEarned"]!
    Test.assert(totalEarned > 0.0, message: "Harvest should generate profit")
}

// Test: Multiple harvests accumulate earnings
pub fun testMultipleHarvests() {
    let account = Test.createAccount()

    executeTransaction("../transactions/setup_vault.cdc", [], account)
    executeTransaction("../transactions/deposit.cdc", [1000.0], account)

    // First harvest
    Test.commitBlock()
    executeTransaction("../transactions/harvest.cdc", [], account)

    let info1 = executeScript("../scripts/get_vault_info.cdc", [account.address])
    let earned1 = (info1 as! {String: UFix64})["totalEarned"]!

    // Second harvest
    Test.commitBlock()
    executeTransaction("../transactions/harvest.cdc", [], account)

    let info2 = executeScript("../scripts/get_vault_info.cdc", [account.address])
    let earned2 = (info2 as! {String: UFix64})["totalEarned"]!

    Test.assert(earned2 > earned1, message: "Total earned should increase")
}

// Test: Insufficient balance withdrawal fails
pub fun testInsufficientWithdrawal() {
    let account = Test.createAccount()

    executeTransaction("../transactions/setup_vault.cdc", [], account)
    executeTransaction("../transactions/deposit.cdc", [100.0], account)

    // Try to withdraw more than balance
    let withdrawResult = executeTransaction(
        "../transactions/withdraw.cdc",
        [150.0],
        account
    )

    Test.expect(withdrawResult, Test.beFailed())
}

// Test: Contract state tracking
pub fun testContractStateTVL() {
    let account1 = Test.createAccount()
    let account2 = Test.createAccount()

    // Setup two vaults
    executeTransaction("../transactions/setup_vault.cdc", [], account1)
    executeTransaction("../transactions/setup_vault.cdc", [], account2)

    // Deposit to both
    executeTransaction("../transactions/deposit.cdc", [500.0], account1)
    executeTransaction("../transactions/deposit.cdc", [300.0], account2)

    // Check total value locked
    let tvl = executeScript("../scripts/get_total_tvl.cdc", [])

    Test.assertEqual(800.0, tvl as! UFix64)
}
