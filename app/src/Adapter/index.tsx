import React, { useCallback, useContext } from 'react'
import { AddCurrency, ShellWrappedProps } from '@unifiprotocol/shell'
import { Currency } from '@unifiprotocol/utils'

type TAdapter = {
  connection: ShellWrappedProps['connection'] | undefined
  balances: ShellWrappedProps['balances']
  eventBus: ShellWrappedProps['eventBus'] | undefined
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

  return {
    addToken,
    connection: state.connection,
    adapter: state.connection?.adapter?.adapter,
    balances: state.balances,
    eventBus: state.eventBus
  }
}
