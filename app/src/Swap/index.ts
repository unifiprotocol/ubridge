import { Blockchains, getBlockchainConfig } from '@unifiprotocol/core-sdk'
import { RefreshBalances } from '@unifiprotocol/shell'
import { BN, Currency } from '@unifiprotocol/utils'
import { ethers } from 'ethers'
import { useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { atom, useRecoilState } from 'recoil'
import { useAdapter } from '../Adapter'
import {
  FailNotification,
  InfoNotification,
  SuccessNotification
} from '../Components/Notifications'
import { useConfig } from '../Config'
import { useLiquidity } from '../Liquidity'
import { useTransactions } from '../Transactions'
import { buildSwapTransaction } from '../Transactions/Helper'
import BridgeService from './BridgeService'

export type TSwap = {
  targetChain: Blockchains | undefined
  targetCurrency: Currency | undefined
  destinationAddress: string
  amount: string
  fees: { [B in Blockchains]?: string }
  allowances: { [ContractAddress: string]: string }
}

const SwapState = atom<TSwap>({
  key: 'swapState',
  default: {
    targetChain: undefined,
    targetCurrency: undefined,
    destinationAddress: '',
    amount: '0',
    allowances: {},
    fees: {}
  }
})

export type SwapStatus =
  | 'OK'
  | 'OVERSIZED'
  | 'OUT_OF_BALANCE'
  | 'DISCONNECTED'
  | 'SELECT_CURRENCY'
  | 'INVALID_AMOUNT'
  | 'INVALID_ADDRESS'
  | 'SAME_CHAIN'

export const useSwap = () => {
  const [{ fees, targetChain, targetCurrency, destinationAddress, amount, allowances }, setSwap] =
    useRecoilState(SwapState)
  const { liquidity } = useLiquidity()
  const { adapter, blockchainConfig, eventBus, getBalanceByCurrency } = useAdapter()
  const { config } = useConfig()
  const { setCurrentTransaction } = useTransactions()
  const { t } = useTranslation()

  // Auto select target chain
  useEffect(() => {
    if (!targetChain || blockchainConfig?.blockchain === targetChain) {
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
    ).then((response) => {
      if (!eventBus) return response
      if (response.success) {
        // Faked one
        setCurrentTransaction(
          buildSwapTransaction(adapter.blockchainConfig, response, {
            withdrawalAddress: destinationAddress,
            originTokenAddress: targetCurrency.address,
            amount: targetCurrency.toPrecision(amount),
            targetChainId
          })
        )

        adapter.waitForTransaction(response.hash).then((v) => {
          if (v === 'FAILED') {
            eventBus.emit(
              FailNotification(
                t('bridge.swap.notification.swap_failed', { token: targetCurrency.symbol })
              )
            )
          } else {
            eventBus.emit(
              SuccessNotification(
                t('bridge.swap.notification.swap_confirmed', { token: targetCurrency.symbol })
              )
            )
          }
          eventBus.emit(new RefreshBalances())
        })
        eventBus.emit(
          InfoNotification(
            t('bridge.swap.notification.swap_sent', { token: targetCurrency.symbol })
          )
        )
      } else {
        eventBus.emit(
          FailNotification(
            t('bridge.swap.notification.swap_failed', { token: targetCurrency.symbol })
          )
        )
      }
      return response
    })
  }, [
    adapter,
    amount,
    destinationAddress,
    eventBus,
    fees,
    setCurrentTransaction,
    t,
    targetChain,
    targetChainId,
    targetCurrency
  ])

  const allowance = useCallback(() => {
    if (!adapter || !targetCurrency || !targetChain) return
    return BridgeService.getTokenAllowance(targetCurrency.address, adapter.getAddress())
  }, [adapter, targetChain, targetCurrency])

  const approve = useCallback(() => {
    if (!adapter || !targetCurrency || !targetChain) return
    return BridgeService.approve(
      targetCurrency.address,
      BN(2).pow(256).minus(1).toFixed(),
      adapter as any
    ).then((response) => {
      if (!eventBus) return response
      if (response.success) {
        adapter.waitForTransaction(response.hash).then((v) => {
          if (v === 'FAILED') {
            eventBus.emit(
              FailNotification(
                t('transactions.desc_approval_failed', { token: targetCurrency.symbol })
              )
            )
          } else {
            eventBus.emit(
              SuccessNotification(
                t('transactions.desc_approval_confirmed', { token: targetCurrency.symbol })
              )
            )
          }
        })
        eventBus.emit(
          InfoNotification(t('transactions.desc_approval_sent', { token: targetCurrency.symbol }))
        )
      } else {
        eventBus.emit(
          FailNotification(t('transactions.desc_approval_failed', { token: targetCurrency.symbol }))
        )
      }
      return response
    })
  }, [adapter, eventBus, t, targetChain, targetCurrency])

  const setFees = (fees: { [B in Blockchains]?: string }) => {
    setSwap((st) => ({ ...st, fees }))
  }

  const setAllowance = (allowances: { [ContractAddress: string]: string }) => {
    setSwap((st) => ({ ...st, allowances }))
  }

  const swapStatus: SwapStatus = useMemo(() => {
    if (!adapter) return 'DISCONNECTED'
    if (targetChain === blockchainConfig?.blockchain) return 'SAME_CHAIN'
    if (BN(amount).gt(maxSwapSize)) return 'OVERSIZED'
    if (BN(amount).isNaN() || BN(amount).lte(0)) return 'INVALID_AMOUNT'
    if (!targetCurrency) return 'SELECT_CURRENCY'
    const { balance } = getBalanceByCurrency(targetCurrency)
    if (BN(balance).lt(amount)) return 'OUT_OF_BALANCE'
    if (!ethers.utils.isAddress(destinationAddress)) return 'INVALID_ADDRESS'
    return 'OK'
  }, [
    adapter,
    amount,
    blockchainConfig?.blockchain,
    destinationAddress,
    maxSwapSize,
    targetChain,
    targetCurrency,
    getBalanceByCurrency
  ])

  return {
    setTargetChain,
    setTargetCurrency,
    setDestinationAddress,
    setAmount,
    setAllowance,
    setToken0: setTargetCurrency,
    setFees,
    deposit,
    allowance,
    approve,
    swapStatus,
    allowances,
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
