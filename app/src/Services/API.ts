import { Blockchains } from '@unifiprotocol/core-sdk'
import { Currency } from '@unifiprotocol/utils'
import { TConfig } from '../Config'

const BASE_ENDPOINT = 'https://proxy.unifiprotocol.com/bridge'

type APIResponse<T> = {
  status: 'ERROR' | 'OK'
  result: T
}

export type BridgeConfigResponse = TConfig

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
