import AutoFlowVault from 0xAUTOFLOWVAULTADDRESS

/// Script to get complete vault information
pub fun main(address: Address): {String: UFix64} {
    let vaultCap = getAccount(address)
        .getCapability<&AutoFlowVault.Vault{AutoFlowVault.VaultPublic}>(AutoFlowVault.VaultPublicPath)
        .borrow()
        ?? panic("Could not borrow vault reference")

    return {
        "balance": vaultCap.getBalance(),
        "totalEarned": vaultCap.getTotalEarned(),
        "lastHarvestTime": vaultCap.getLastHarvestTime()
    }
}
