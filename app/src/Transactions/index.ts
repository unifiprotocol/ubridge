import { Blockchains } from '@unifiprotocol/core-sdk'
import { useCallback } from 'react'
import { atom, useRecoilState } from 'recoil'
import { DateTime } from 'luxon'
import { useAdapter } from '../Adapter'
import { fetchTransactions, TransactionsResponse } from '../Services/API'
import { ChainIdBlockchain } from '../Services/Connectors'

export type SwapTransaction = { time: Date; blockchain: Blockchains } & TransactionsResponse

export type TTransactions = {
  currentTransaction: undefined | SwapTransaction
  swaps: SwapTransaction[]
  transactions: { [K in Blockchains]: SwapTransaction[] }
}

function getInitialState() {
  return Object.values(Blockchains).reduce((t, curr) => {
    const blockchain = curr as Blockchains
    t[blockchain] = []
    return t
  }, {} as TTransactions['transactions'])
}

const initialState: TTransactions = {
  currentTransaction: undefined,
  transactions: getInitialState(),
  swaps: []
}

const TransactionsState = atom<TTransactions>({
  key: 'transactionsState',
  default: initialState
})

export const useTransactions = () => {
  const [{ swaps, transactions, currentTransaction }, setTransactions] =
    useRecoilState(TransactionsState)
  const { adapter } = useAdapter()

  const updateTransactions = useCallback(async () => {
    if (adapter) {
      const address = adapter.getAddress()
      const { swaps, transactions } = await fetchTransactions(address).then((res) => {
        const swaps: TTransactions['swaps'] = []
        const transactions = res.reduce((transactions: TTransactions['transactions'], swap) => {
          const { origin_chain_id } = swap
          const { time } = swap.transactions[0]
          const blockchain = ChainIdBlockchain[Number(origin_chain_id)]
          if (!transactions[blockchain]) transactions[blockchain] = []
          const dt = DateTime.fromISO(time, { zone: 'UTC' })
          const item = { ...swap, time: dt.toJSDate(), blockchain }
          swaps.push(item)
          transactions[blockchain].push(item)
          return transactions
        }, {} as TTransactions['transactions'])
        swaps.sort((a, b) => b.time.valueOf() - a.time.valueOf())
        return { swaps, transactions }
      })
      setTransactions((st) => ({ ...st, swaps, transactions }))
    }
  }, [adapter, setTransactions])

  const setCurrentTransaction = useCallback(
    (swapTransaction: SwapTransaction) => {
      setTransactions((st) => ({ ...st, currentTransaction: swapTransaction }))
    },
    [setTransactions]
  )

  return { swaps, transactions, currentTransaction, updateTransactions, setCurrentTransaction }
}
