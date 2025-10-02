import AutoFlowVault from 0xAUTOFLOWVAULTADDRESS

/// Script to get vault balance
pub fun main(address: Address): UFix64 {
    let vaultCap = getAccount(address)
        .getCapability<&AutoFlowVault.Vault{AutoFlowVault.VaultPublic}>(AutoFlowVault.VaultPublicPath)
        .borrow()
        ?? panic("Could not borrow vault reference")

    return vaultCap.getBalance()
}
