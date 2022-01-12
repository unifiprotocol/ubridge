export interface Blockchain {
  logo: string
  name: string
}

export const Blockchains: Record<string, Blockchain> = {
  Bsc: {
    logo: 'https://assets.unifiprotocol.com/BNB.png',
    name: 'Binance'
  },
  Eth: {
    logo: 'https://assets.unifiprotocol.com/ETH.png',
    name: 'Ethereum'
  }
}

export const BlockchainList = Object.values(Blockchains)
