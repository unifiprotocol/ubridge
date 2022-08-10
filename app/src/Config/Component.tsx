import { useCallback, useEffect, useState } from 'react'
import {
  AdapterConnectedEvent,
  AddressChangedEvent,
  NetworkChangedEvent,
  RefreshBalances
} from '@unifiprotocol/shell'
import { useConfig } from '.'
import { useAdapter } from '../Adapter'
import { fetchConfig } from '../Services/API'

export const Config = () => {
  const [init, setInit] = useState(false)
  const { config, setConfig } = useConfig()
  const { adapter, eventBus, addToken } = useAdapter()

  const initializeTokens = useCallback(() => {
    if (adapter?.isConnected()) {
      const blockchain = adapter.blockchainConfig.blockchain
      const cfg = config[blockchain]
      if (cfg) {
        Object.values(cfg.tokens).forEach((currency) => {
          addToken(currency)
        })
        setTimeout(() => eventBus?.emit(new RefreshBalances()), 1000)
      }
    }
  }, [adapter, config, eventBus, addToken])

  useEffect(() => {
    if (adapter?.isConnected() && Object.keys(config).length > 0 && !init) {
      initializeTokens()
      setInit(true)
    }
  }, [adapter, config, init, initializeTokens])

  useEffect(() => {
    fetchConfig().then((cfg) => {
      setConfig(cfg.result)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const fn = () => setInit(false)
    eventBus?.on(NetworkChangedEvent, fn)
    return () => {
      eventBus?.off(NetworkChangedEvent, fn)
    }
  }, [eventBus])

  useEffect(() => {
    const fn = () => setInit(false)
    eventBus?.on(AddressChangedEvent, fn)
    return () => {
      eventBus?.off(AddressChangedEvent, fn)
    }
  }, [eventBus])

  useEffect(() => {
    const fn = () => setInit(false)
    eventBus?.on(AdapterConnectedEvent, fn)
    return () => {
      eventBus?.off(AdapterConnectedEvent, fn)
    }
  }, [eventBus])

  return <></>
}
