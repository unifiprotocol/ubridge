export enum ERC20ContractMethods {
  BalanceOf = "balanceOf",
}

export type TERC20Params<T = any> = {
  contractAddress: string;
  params: T;
};
