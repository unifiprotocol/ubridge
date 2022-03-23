import { Blockchains } from '@unifiprotocol/core-sdk'
import { Currency } from '@unifiprotocol/utils'
import { TConfig } from '../Config'

const BASE_ENDPOINT = 'https://proxy.unifiprotocol.com/bridge'

type APIResponse<T> = {
  status: 'ERROR' | 'OK'
  result: T
}

export type BridgeConfigResponse = TConfig

export interface ITransactionRow {
  args: {
    count: string
    amount: string
    originChainId: string
    targetChainId: string
    withdrawalAddress: string
    originTokenAddress: string
    destinationTokenAddress: string
  }
  name: 'Withdraw' | 'Deposit'
  time: string
  topic: string
  address: string
  tx_hash: string
  signature: string
  blockchain: Blockchains
}

export type TransactionsResponse = {
  transactions: ITransactionRow[]
  count: string
  origin_chain_id: string
}

export async function fetchConfig(): Promise<APIResponse<BridgeConfigResponse>> {
  const response: APIResponse<BridgeConfigResponse> = await fetch(
    `${BASE_ENDPOINT}/v1/blockchains`
  ).then((res) => res.json())
  Object.keys(response.result).forEach((b) => {
    const blockchain = b as Blockchains
    const blockchainConfig = response.result[blockchain]!
    Object.keys(blockchainConfig.tokens).forEach((token) => {
      const currToken = blockchainConfig.tokens[token]
      blockchainConfig.tokens[token] = new Currency(
        currToken.address,
        currToken.decimals,
        currToken.symbol,
        currToken.name
      )
    })
  })
  return { ...response }
}

export async function fetchTransactions(address: string): Promise<TransactionsResponse[]> {
  return fetch(`${BASE_ENDPOINT}/v1/transactions/${address}`)
    .then((res) => res.json())
    .then((res: APIResponse<TransactionsResponse[]>) => {
      if (res.status === 'OK') {
        return res.result
      }
      return [] as TransactionsResponse[]
    })
}
