import {
  AdapterConnectedEvent,
  AddressChangedEvent,
  NetworkChangedEvent
} from '@unifiprotocol/shell'
import { BN } from '@unifiprotocol/utils'
import React, { useCallback, useEffect, useState } from 'react'
import { TSwap, useSwap } from '.'
import { useAdapter } from '../Adapter'
import { useConfig } from '../Config'
import Clocks from '../Services/Clocks'
import { ChainIdBlockchain } from '../Services/Connectors'
import BridgeService from './BridgeService'

export const Swap = () => {
  const [init, setInit] = useState(false)
  const { config, blockchainConfig: appConfig } = useConfig()
  const { adapter, blockchainConfig, eventBus } = useAdapter()
  const { fees, setFees, setAllowance } = useSwap()

  const updateChainFees = useCallback(async () => {
    const supportedChainIds = await BridgeService.getChainIds().then((x) => x.value)
    const chainIdFees: typeof fees = {}
    for (const chainId of supportedChainIds) {
      const nChain = BN(chainId).toNumber()
      const chainIdFee = await BridgeService.getChainIdFee(nChain).then((x) => x.value)
      const blockchain = ChainIdBlockchain[nChain]
      chainIdFees[blockchain] = chainIdFee
    }
    setFees(chainIdFees)
  }, [setFees])

  const updateAllowance = useCallback(async () => {
    if (!appConfig || !adapter) return
    const tokens = Object.keys(appConfig.tokens).map(
      (tokenName) => appConfig.tokens[tokenName].address
    )
    const allowances = await Promise.all(
      tokens.map((t) =>
        BridgeService.getTokenAllowance(t, adapter.getAddress()).then((x) => ({
          token: t,
          value: x.value
        }))
      )
    )
    const allowance = allowances.reduce((t: TSwap['allowances'], curr) => {
      t[curr.token] = curr.value
      return t
    }, {})
    setAllowance(allowance)
  }, [adapter, appConfig, setAllowance])

  useEffect(() => {
    if (blockchainConfig && appConfig && Object.keys(config).length > 0) {
      BridgeService.setConfig(config)
      BridgeService.setBlockchain(blockchainConfig.blockchain)
      if (!init) {
        updateAllowance()
        updateChainFees()
        setInit(true)
      }
    }
  }, [init, blockchainConfig, config, updateChainFees, appConfig, updateAllowance])

  useEffect(() => {
    const fn = () => updateAllowance()
    Clocks.on('THIRTY_SECONDS', fn)
    return () => {
      Clocks.off('THIRTY_SECONDS', fn)
    }
  }, [updateAllowance])

  useEffect(() => {
    const fn = () => setInit(false)
    eventBus?.on(NetworkChangedEvent, fn)
    return () => {
      eventBus?.off(NetworkChangedEvent, fn)
    }
  }, [adapter, eventBus])

  useEffect(() => {
    const fn = () => setInit(false)
    eventBus?.on(AddressChangedEvent, fn)
    return () => {
      eventBus?.off(AddressChangedEvent, fn)
    }
  }, [adapter, eventBus])

  useEffect(() => {
    const fn = () => setInit(false)
    eventBus?.on(AdapterConnectedEvent, fn)
    return () => {
      eventBus?.off(AdapterConnectedEvent, fn)
    }
  }, [adapter, eventBus])

  return <></>
}
