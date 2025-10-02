import AutoFlowVault from 0xAUTOFLOWVAULTADDRESS
import FungibleToken from 0x9a0766d93b6608b7
import FlowToken from 0x0ae53cb6e3f42a79

/// Transaction to withdraw funds from AutoFlow vault
transaction(amount: UFix64) {
    let vaultRef: &AutoFlowVault.Vault{AutoFlowVault.VaultPrivate}
    let receiverRef: &{FungibleToken.Receiver}

    prepare(signer: AuthAccount) {
        // Borrow private vault reference
        self.vaultRef = signer.borrow<&AutoFlowVault.Vault{AutoFlowVault.VaultPrivate}>(
            from: AutoFlowVault.VaultStoragePath
        ) ?? panic("Could not borrow vault reference")

        // Borrow receiver reference for user's token vault
        self.receiverRef = signer.borrow<&{FungibleToken.Receiver}>(from: /storage/flowTokenVault)
            ?? panic("Could not borrow receiver reference")
    }

    execute {
        // Withdraw from AutoFlow vault
        let tokens <- self.vaultRef.withdraw(amount: amount)

        // Deposit to user's token vault
        self.receiverRef.deposit(from: <-tokens)

        log("Withdrawn ".concat(amount.toString()).concat(" tokens from AutoFlow vault"))
    }
}
