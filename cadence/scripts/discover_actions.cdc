import FlowActionRegistry from 0xFLOWACTIONREGISTRYADDRESS

/// Script to discover all available Flow Actions
pub fun main(registryAddress: Address): [{String: AnyStruct}] {
    let registryCap = getAccount(registryAddress)
        .getCapability<&FlowActionRegistry.Registry{FlowActionRegistry.RegistryPublic}>(
            FlowActionRegistry.RegistryPublicPath
        )
        .borrow()
        ?? panic("Could not borrow registry reference")

    return registryCap.discoverActions()
}
