import { Blockchains, getBlockchainConfig } from '@unifiprotocol/core-sdk'
import { Currency } from '@unifiprotocol/utils'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { atom, useRecoilState } from 'recoil'
import { useAdapter } from '../Adapter'
import { useLiquidity } from '../Liquidity'

export type TSwap = {
  targetChain: Blockchains | undefined
  targetCurrency: Currency | undefined
  destinationAddress: string
}

const SwapState = atom<TSwap>({
  key: 'swapState',
  default: {
    targetChain: undefined,
    targetCurrency: undefined,
    destinationAddress: ''
  }
})

export const useSwap = () => {
  const [{ targetChain, targetCurrency, destinationAddress }, setSwap] = useRecoilState(SwapState)
  const { liquidity } = useLiquidity()
  const { adapter } = useAdapter()
  const [amount, setAmount] = useState('0')

  const setDestinationAddress = useCallback(
    (destinationAddress: string) => {
      setSwap((st) => ({ ...st, destinationAddress }))
    },
    [setSwap]
  )

  useEffect(() => {
    if (destinationAddress === '' && adapter?.isConnected()) {
      setDestinationAddress(adapter.getAddress())
    }
  }, [adapter, destinationAddress, setDestinationAddress])

  const maxSwapSize = useMemo(() => {
    if (!targetChain || !targetCurrency) return '0'
    const targetChainLiquidity = liquidity[targetChain]
    const targetCurrencyBalance = targetChainLiquidity.find((t) =>
      t.currency.equals(targetCurrency)
    )
    if (!targetCurrencyBalance) return '0'
    return targetCurrencyBalance.currency.toFactorized(targetCurrencyBalance.balance)
  }, [liquidity, targetChain, targetCurrency])

  const setTargetChain = (target: Blockchains) => setSwap((st) => ({ ...st, targetChain: target }))

  const setTargetCurrency = (target: Currency) =>
    setSwap((st) => ({ ...st, targetCurrency: target }))

  const targetBlockchainConfig = useMemo(
    () => (targetChain ? getBlockchainConfig(targetChain) : undefined),
    [targetChain]
  )

  const targetChainId = useMemo(() => {
    if (!targetChain || !targetBlockchainConfig) return 0
    return targetBlockchainConfig.chainId ?? 0
  }, [targetChain, targetBlockchainConfig])

  return {
    setTargetChain,
    setTargetCurrency,
    setDestinationAddress,
    setAmount,
    setToken0: setTargetCurrency,
    targetCurrency,
    targetChain,
    targetChainId,
    maxSwapSize,
    amount,
    token0: targetCurrency,
    token1: targetCurrency,
    destinationAddress
  }
}
