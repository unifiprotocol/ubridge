import { Blockchains } from '@unifiprotocol/core-sdk'
import { ethers } from 'ethers'
import { useCallback, useMemo } from 'react'
import { atom, useRecoilState } from 'recoil'
import { useConfig } from '../Config'
import { useLiquidity } from '../Liquidity'
import { offlineConnectors } from '../Services/Connectors'
import UBridge from '../Contracts/ABI/UBridge.json'

export type TTransactions = {
  deposits: { [B in Blockchains]: ethers.Transaction[] }
  withdraws: { [B in Blockchains]: ethers.Transaction[] }
}

function getInitialState() {
  return Object.values(Blockchains).reduce((t, curr) => {
    const blockchain = curr as Blockchains
    t[blockchain] = []
    return t
  }, {} as TTransactions['deposits'] | TTransactions['withdraws'])
}

const initialState: TTransactions = {
  deposits: getInitialState(),
  withdraws: getInitialState()
}

const TransactionsState = atom<TTransactions>({
  key: 'transactionsState',
  default: initialState
})

const BLOCK_RANGE_LIMIT = 1000

export const useTransactions = () => {
  const [{ deposits, withdraws }, setTransactions] = useRecoilState(TransactionsState)
  const { liquidity } = useLiquidity()
  const { config } = useConfig()

  const supportedBlockchains = useMemo(
    () =>
      Object.keys(liquidity).filter((b) => {
        const blockchain = b as Blockchains
        const cfg = config[blockchain]
        return cfg?.type === 'mainnet' ?? false
      }) as Blockchains[],
    [config, liquidity]
  )

  const updateState = useCallback(() => {
    const fn = async (blockchain: Blockchains) => {
      const connector = offlineConnectors[blockchain]
      const chainCfg = config[blockchain]!
      const provider = connector.adapter?.adapter.getProvider() as ethers.providers.BaseProvider
      const contract = new ethers.Contract(chainCfg.bridgeContract, UBridge.abi, provider)
      const filter = contract.filters.Deposit()
      const deposits = await contract.queryFilter(filter, 1 - BLOCK_RANGE_LIMIT)
    }
  }, [config])

  return { deposits, withdraws }
}
