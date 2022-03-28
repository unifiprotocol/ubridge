import { ContractUseCase } from '@unifiprotocol/core-sdk'
import { UBridgeContractMethods } from './Types'

export interface DepositParams {
  contractAddress: string
  withdrawalAddress: string
  originTokenAddress: string
  amount: string
  targetChainId: number
  fee: string
}

export class Deposit extends ContractUseCase<UBridgeContractMethods, DepositParams, string> {
  constructor(params: DepositParams) {
    super(params.contractAddress, UBridgeContractMethods.deposit, params, true)
  }

  getCallValue() {
    return this.params.fee
  }

  getArgs() {
    return [
      this.params.withdrawalAddress,
      this.params.originTokenAddress,
      this.params.amount,
      this.params.targetChainId
    ]
  }
}
