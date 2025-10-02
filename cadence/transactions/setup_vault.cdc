import AutoFlowVault from 0xAUTOFLOWVAULTADDRESS
import FungibleToken from 0x9a0766d93b6608b7

/// Transaction to setup AutoFlow vault in user account
transaction {
    prepare(signer: AuthAccount) {
        // Check if vault already exists
        if signer.borrow<&AutoFlowVault.Vault>(from: AutoFlowVault.VaultStoragePath) != nil {
            return
        }

        // Create new vault
        let vault <- AutoFlowVault.createEmptyVault(owner: signer.address)

        // Save vault to storage
        signer.save(<-vault, to: AutoFlowVault.VaultStoragePath)

        // Link public capability
        signer.link<&AutoFlowVault.Vault{AutoFlowVault.VaultPublic}>(
            AutoFlowVault.VaultPublicPath,
            target: AutoFlowVault.VaultStoragePath
        )

        // Link private capability for authorized operations
        signer.link<&AutoFlowVault.Vault{AutoFlowVault.VaultPrivate}>(
            AutoFlowVault.VaultPrivatePath,
            target: AutoFlowVault.VaultStoragePath
        )

        log("AutoFlow vault setup complete")
    }
}
