import { ContractUseCase } from '@unifiprotocol/core-sdk'
import { ERC20ContractMethods } from './Types'

export interface AllowanceParams {
  tokenAddress: string
  owner: string
  spender: string
}

export class Allowance extends ContractUseCase<ERC20ContractMethods, AllowanceParams, string> {
  constructor(params: AllowanceParams) {
    super(params.tokenAddress, ERC20ContractMethods.Allowance, params, false)
  }

  getArgs() {
    return [this.params.owner, this.params.spender]
  }
}
