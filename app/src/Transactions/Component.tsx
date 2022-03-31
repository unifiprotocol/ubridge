import React, { useEffect, useState } from 'react'
import { useTransactions } from '.'
import { useAdapter } from '../Adapter'
import Clocks from '../Services/Clocks'

export const Transactions = () => {
  const [init, setInit] = useState(false)
  const { currentTransaction, swaps, updateTransactions, setCurrentTransaction } = useTransactions()
  const { adapter } = useAdapter()

  useEffect(() => {
    if (adapter?.isConnected() && !init) {
      updateTransactions()
      setInit(true)
    }
  }, [adapter, init, updateTransactions])

  useEffect(() => {
    const fn = () => adapter?.isConnected() && updateTransactions()
    Clocks.on('THIRTY_SECONDS', fn)
    return () => {
      Clocks.off('THIRTY_SECONDS', fn)
    }
  }, [adapter, updateTransactions])

  useEffect(() => {
    if (currentTransaction) {
      for (const swap of swaps) {
        const actualTransaction = swap.transactions.some(
          (t) => t.tx_hash === currentTransaction.transactions[0].tx_hash
        )
        if (actualTransaction) {
          setCurrentTransaction(swap)
        }
      }
    }
  }, [currentTransaction, setCurrentTransaction, swaps])

  return <></>
}
