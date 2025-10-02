import AutoFlowVault from 0xAUTOFLOWVAULTADDRESS
import FungibleToken from 0x9a0766d93b6608b7
import FlowToken from 0x0ae53cb6e3f42a79

/// Transaction to deposit funds into AutoFlow vault
transaction(amount: UFix64) {
    let vaultRef: &AutoFlowVault.Vault{AutoFlowVault.VaultPublic}
    let tokenVault: @FungibleToken.Vault

    prepare(signer: AuthAccount) {
        // Borrow vault reference
        self.vaultRef = signer.borrow<&AutoFlowVault.Vault{AutoFlowVault.VaultPublic}>(
            from: AutoFlowVault.VaultStoragePath
        ) ?? panic("Could not borrow vault reference")

        // Withdraw tokens from user's FlowToken vault (using FlowToken as USDC placeholder)
        let flowVault = signer.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)
            ?? panic("Could not borrow FlowToken vault")

        self.tokenVault <- flowVault.withdraw(amount: amount)
    }

    execute {
        // Deposit into AutoFlow vault
        self.vaultRef.deposit(from: <-self.tokenVault)

        log("Deposited ".concat(amount.toString()).concat(" tokens into AutoFlow vault"))
    }
}
