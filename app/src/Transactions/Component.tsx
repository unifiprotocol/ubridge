import React, { useEffect, useState } from 'react'
import { useTransactions } from '.'
import { useAdapter } from '../Adapter'
import Clocks from '../Services/Clocks'

export const Transactions = () => {
  const [init, setInit] = useState(false)
  const { updateTransactions } = useTransactions()
  const { adapter } = useAdapter()

  useEffect(() => {
    if (adapter?.isConnected() && !init) {
      updateTransactions()
      setInit(true)
    }
  }, [adapter, init, updateTransactions])

  useEffect(() => {
    const fn = () => adapter?.isConnected() && updateTransactions()
    Clocks.on('TEN_SECONDS', fn)
    return () => {
      Clocks.off('TEN_SECONDS', fn)
    }
  }, [adapter, updateTransactions])

  return <></>
}
