import { Blockchains, Currency } from '@unifiprotocol/utils'
import { useMemo } from 'react'
import { atom, useRecoilState } from 'recoil'
import { useAdapter } from '../Adapter'

export type TConfig = {
  [B in Blockchains]?: {
    bridgeContract: string
    tokens: {
      [T: string]: Currency
    }
    type: 'mainnet' | 'testnet'
  }
}

const ConfigState = atom<TConfig>({
  key: 'configState',
  default: {}
})

export const useConfig = () => {
  const [config, setConfig] = useRecoilState(ConfigState)
  const { connection } = useAdapter()

  const blockchainConfig = useMemo(() => {
    return connection && config[connection.config.blockchain]
      ? config[connection.config.blockchain]
      : undefined
  }, [config, connection])

  const tokensSupported = useMemo(() => {
    return Object.keys(config).reduce(
      (
        tokens: { [tokenAdress: string]: { currency: Currency; blockchain: Blockchains } },
        chain
      ) => {
        const blockchain = chain as Blockchains
        const cfg = config[blockchain]!
        Object.entries(cfg.tokens).forEach(([, currency]) => {
          tokens[currency.address] = {
            currency,
            blockchain
          }
        })
        return tokens
      },
      {}
    )
  }, [config])

  return {
    config,
    blockchainConfig,
    tokensSupported,
    setConfig
  }
}
