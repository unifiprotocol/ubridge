export enum UBridgeContractMethods {
  chainIdFees = 'chainIdFees',
  getChainIds = 'getChainIds',
  deposit = 'deposit'
}

export type TUBridgeParams<T = any> = {
  contractAddress: string
  params: T
}
