import React, { useCallback, useContext } from 'react'
import { AddCurrency, ShellWrappedProps } from '@unifiprotocol/shell'
import { Currency } from '@unifiprotocol/utils'

type TAdapter = {
  connection: ShellWrappedProps['connection'] | undefined
  eventBus: ShellWrappedProps['eventBus'] | undefined
  balances: ShellWrappedProps['balances']
}

export const AdapterContext = React.createContext<TAdapter>({
  connection: undefined,
  eventBus: undefined,
  balances: []
})

export const useAdapter = () => {
  const state = useContext(AdapterContext)

  const addToken = useCallback(
    (currency: Currency) => {
      const { eventBus } = state
      if (eventBus) {
        eventBus.emit(new AddCurrency(currency))
      }
    },
    [state]
  )

  const getBalanceByCurrency = useCallback(
    (currency: Currency) => {
      const balance = state.balances.find((c) => c.currency.equals(currency))
      return balance ?? { currency, balance: '0' }
    },
    [state.balances]
  )

  return {
    addToken,
    getBalanceByCurrency,
    connection: state.connection,
    adapter: state.connection?.adapter?.adapter,
    blockchainConfig: state.connection?.config,
    balances: state.balances,
    eventBus: state.eventBus
  }
}
