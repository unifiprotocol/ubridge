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

  return {
    config,
    blockchainConfig,
    setConfig
  }
}
