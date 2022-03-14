export enum UBridgeContractMethods {
  chainIdFees = 'chainIdFees',
  getChainIds = 'getChainIds'
}

export type TUBridgeParams<T = any> = {
  contractAddress: string
  params: T
}
