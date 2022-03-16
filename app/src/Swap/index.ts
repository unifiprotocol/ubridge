import { Blockchains, getBlockchainConfig } from '@unifiprotocol/core-sdk'
import { Currency } from '@unifiprotocol/utils'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { atom, useRecoilState } from 'recoil'
import { useAdapter } from '../Adapter'
import { useConfig } from '../Config'
import { useLiquidity } from '../Liquidity'
import BridgeService from './BridgeService'

export type TSwap = {
  targetChain: Blockchains | undefined
  targetCurrency: Currency | undefined
  destinationAddress: string
  amount: string
  fees: { [B in Blockchains]?: string }
}

const SwapState = atom<TSwap>({
  key: 'swapState',
  default: {
    targetChain: undefined,
    targetCurrency: undefined,
    destinationAddress: '',
    amount: '0',
    fees: {}
  }
})

export const useSwap = () => {
  const [{ fees, targetChain, targetCurrency, destinationAddress, amount }, setSwap] =
    useRecoilState(SwapState)
  const { liquidity } = useLiquidity()
  const { adapter, blockchainConfig } = useAdapter()
  const { config } = useConfig()

  // Auto select target chain
  useEffect(() => {
    if (!targetChain) {
      const tChain = Object.keys(config).find((b) => {
        const blockchain = b as Blockchains
        const curr = config[blockchain]
        return curr?.type !== 'testnet' && blockchain !== blockchainConfig?.blockchain
      })
      if (tChain) {
        const targetChain = tChain as Blockchains
        setSwap((st) => ({ ...st, targetChain }))
      }
    }
  }, [blockchainConfig?.blockchain, config, setSwap, targetChain])

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
    const targetCurrencyBalance = targetChainLiquidity.find(
      (t) => t.currency.symbol === targetCurrency.symbol
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

  const setAmount = (amount: string) => setSwap((st) => ({ ...st, amount }))

  const deposit = useCallback(() => {
    if (!adapter || !targetCurrency || !targetChain) return
    const fee = fees[targetChain]!
    return BridgeService.deposit(
      destinationAddress,
      targetCurrency.address,
      targetCurrency.toPrecision(amount),
      targetChainId,
      fee,
      adapter as any
    ).then(console.log)
  }, [adapter, amount, destinationAddress, fees, targetChain, targetChainId, targetCurrency])

  const setFees = (fees: { [B in Blockchains]?: string }) => {
    setSwap((st) => ({ ...st, fees }))
  }

  return {
    setTargetChain,
    setTargetCurrency,
    setDestinationAddress,
    setAmount,
    setToken0: setTargetCurrency,
    setFees,
    deposit,
    fees,
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
