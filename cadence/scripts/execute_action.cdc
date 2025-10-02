import FlowActionRegistry from 0xFLOWACTIONREGISTRYADDRESS

/// Script to execute a Flow Action
pub fun main(registryAddress: Address, actionId: String, payload: {String: AnyStruct}): {String: AnyStruct} {
    let registryCap = getAccount(registryAddress)
        .getCapability<&FlowActionRegistry.Registry{FlowActionRegistry.RegistryPublic}>(
            FlowActionRegistry.RegistryPublicPath
        )
        .borrow()
        ?? panic("Could not borrow registry reference")

    return registryCap.executeAction(id: actionId, payload: payload)
}
