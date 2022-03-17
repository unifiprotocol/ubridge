export enum ERC20ContractMethods {
  BalanceOf = 'balanceOf',
  Approve = 'approve',
  Allowance = 'allowance'
}

export type TERC20Params<T = any> = {
  contractAddress: string
  params: T
}
