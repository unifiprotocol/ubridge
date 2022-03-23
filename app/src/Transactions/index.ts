import { Blockchains } from '@unifiprotocol/core-sdk'
import { useCallback } from 'react'
import { atom, useRecoilState } from 'recoil'
import { useAdapter } from '../Adapter'
import { fetchTransactions, TransactionsResponse } from '../Services/API'
import { ChainIdBlockchain } from '../Services/Connectors'

export type SwapTransaction = { time: Date; blockchain: Blockchains } & TransactionsResponse

export type TTransactions = {
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
  transactions: getInitialState(),
  swaps: []
}

const TransactionsState = atom<TTransactions>({
  key: 'transactionsState',
  default: initialState
})

export const useTransactions = () => {
  const [{ swaps, transactions }, setTransactions] = useRecoilState(TransactionsState)
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
          const item = { ...swap, time: new Date(time), blockchain }
          swaps.push(item)
          transactions[blockchain].push(item)
          return transactions
        }, {} as TTransactions['transactions'])
        return { swaps, transactions }
      })
      setTransactions({ swaps, transactions })
    }
  }, [adapter, setTransactions])

  return { swaps, transactions, updateTransactions }
}
