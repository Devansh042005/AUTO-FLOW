import AutoFlowVault from 0xAUTOFLOWVAULTADDRESS

/// Script to get total value locked across all vaults
pub fun main(): UFix64 {
    return AutoFlowVault.getTotalValueLocked()
}
