import {
  getBlockchainOfflineConnector,
  IConnector,
  Blockchains,
  getBlockchainConfig
} from '@unifiprotocol/core-sdk'

export const offlineConnectors = (() => {
  return Object.values(Blockchains).reduce(
    (obj: { [B in Blockchains]?: IConnector }, b: string) => {
      const blockchain = b as Blockchains
      const connector = getBlockchainOfflineConnector(blockchain, { random: true })
      connector.connect()
      obj[blockchain] = connector
      return obj
    },
    {}
  )
})() as { [B in Blockchains]: IConnector }

export const BlockchainChainId = (() => {
  return Object.values(Blockchains).reduce((obj: { [B in Blockchains]?: number }, b: string) => {
    const blockchain = b as Blockchains
    const config = getBlockchainConfig(blockchain)
    obj[blockchain] = config.chainId
    return obj
  }, {})
})() as { [B in Blockchains]: number }

export const ChainIdBlockchain = Object.fromEntries(
  Object.entries(BlockchainChainId).map((a) => a.reverse())
) as { [K: number]: Blockchains }
