import { getBlockchainOfflineConnector, IConnector, Blockchains } from '@unifiprotocol/core-sdk'

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
