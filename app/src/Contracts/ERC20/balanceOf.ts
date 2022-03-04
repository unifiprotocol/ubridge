import { ContractUseCase } from "@unifiprotocol/core-sdk";
import { ERC20ContractMethods } from "./Types";

export interface BalanceOfParams {
  owner: string;
  tokenAddress: string;
}

export class BalanceOf extends ContractUseCase<
  ERC20ContractMethods,
  BalanceOfParams,
  string
> {
  constructor(params: BalanceOfParams) {
    super(params.tokenAddress, ERC20ContractMethods.BalanceOf, params, false);
  }

  getArgs() {
    return [this.params.owner];
  }
}
