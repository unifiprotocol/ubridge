import { ContractUseCase } from '@unifiprotocol/core-sdk'
import { UBridgeContractMethods } from './Types'

interface GetChainIdsParams {
  contractAddress: string
}

export class GetChainIds extends ContractUseCase<UBridgeContractMethods, {}, string[]> {
  constructor(params: GetChainIdsParams) {
    super(params.contractAddress, UBridgeContractMethods.getChainIds, params, false)
  }
}
