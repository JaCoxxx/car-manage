const INTERFACE_ADDRESS = 'http://localhost:3002'

export const useUrl = url => `${INTERFACE_ADDRESS}/user/${url}`

export const empUrl = url => `${INTERFACE_ADDRESS}/emp/${url}`

export const orderUrl = url => `${INTERFACE_ADDRESS}/order/${url}`

export const adminUrl = url => `${INTERFACE_ADDRESS}/admin/${url}`