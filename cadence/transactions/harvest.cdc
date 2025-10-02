import AutoFlowVault from 0xAUTOFLOWVAULTADDRESS

/// Transaction to execute harvest on AutoFlow vault
transaction {
    let vaultRef: &AutoFlowVault.Vault{AutoFlowVault.VaultPrivate}

    prepare(signer: AuthAccount) {
        // Borrow private vault reference
        self.vaultRef = signer.borrow<&AutoFlowVault.Vault{AutoFlowVault.VaultPrivate}>(
            from: AutoFlowVault.VaultStoragePath
        ) ?? panic("Could not borrow vault reference")
    }

    execute {
        // Execute harvest
        let profit = self.vaultRef.harvest()

        log("Harvest executed. Profit: ".concat(profit.toString()))
    }
}
