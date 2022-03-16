import React, { useCallback, useEffect, useState } from 'react'
import { useSwap } from '.'
import { useAdapter } from '../Adapter'
import { useConfig } from '../Config'
import { ChainIdBlockchain } from '../Services/Connectors'
import BridgeService from './BridgeService'

export const Swap = () => {
  const [init, setInit] = useState(false)
  const { config } = useConfig()
  const { blockchainConfig } = useAdapter()
  const { fees, setFees } = useSwap()

  const updateChainFees = useCallback(async () => {
    const supportedChainIds = await BridgeService.getChainIds().then((x) => x.value)
    const chainIdFees: typeof fees = {}
    for (const chainId of supportedChainIds) {
      const nChain = Number(chainId)
      const chainIdFee = await BridgeService.getChainIdFee(nChain).then((x) => x.value)
      const blockchain = ChainIdBlockchain[nChain]
      chainIdFees[blockchain] = chainIdFee
    }
    setFees(chainIdFees)
  }, [setFees])

  useEffect(() => {
    if (blockchainConfig && Object.keys(config).length > 0) {
      BridgeService.setConfig(config)
      BridgeService.setBlockchain(blockchainConfig.blockchain)
      if (!init) {
        updateChainFees()
        setInit(true)
      }
    }
  }, [init, blockchainConfig, config, updateChainFees])

  return <></>
}
