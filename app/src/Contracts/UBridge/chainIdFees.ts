import { ContractUseCase } from '@unifiprotocol/core-sdk'
import { UBridgeContractMethods } from './Types'

export interface GetChainIdFeesParams {
  contractAddress: string
  chainId: number
}

export class GetChainIdFee extends ContractUseCase<
  UBridgeContractMethods,
  GetChainIdFeesParams,
  string
> {
  constructor(params: GetChainIdFeesParams) {
    super(params.contractAddress, UBridgeContractMethods.chainIdFees, params, false)
  }

  getArgs() {
    return [this.params.chainId]
  }
}
