import React, { useMemo } from 'react'
import { ShinyWrapper } from '@unifiprotocol/uikit'
import { TransactionBarContent, TransactionBarWapper } from './Styles'
import { useTransactions } from '../../Transactions'
import { useConfig } from '../../Config'
import { getBlockchainConfig } from '@unifiprotocol/core-sdk'
import { ChainIdBlockchain } from '../../Services/Connectors'
import { getVernacularBlockchain } from '@unifiprotocol/utils'

export const TransactionBar = () => {
  const { tokensSupported } = useConfig()
  const { currentTransaction } = useTransactions()

  const targetBlockchainConfig = useMemo(() => {
    if (!currentTransaction) return undefined
    return getBlockchainConfig(
      ChainIdBlockchain[Number(currentTransaction.transactions[0].args.targetChainId)]
    )
  }, [currentTransaction])

  const isActive = useMemo(() => {
    if (!currentTransaction) return false
    if (currentTransaction.transactions.length === 2) return false
    return true
  }, [currentTransaction])

  const token = useMemo(() => {
    if (!currentTransaction) return undefined
    return tokensSupported[currentTransaction.transactions[0].args.originTokenAddress]
  }, [currentTransaction, tokensSupported])

  const amount = useMemo(() => {
    if (!currentTransaction || !token) return '0'
    const transaction = currentTransaction.transactions[0]
    return token.currency.toFactorized(transaction.args.amount)
  }, [currentTransaction, token])

  return (
    <TransactionBarWapper active={isActive}>
      <ShinyWrapper active mode={'manual'}>
        <TransactionBarContent>
          <span>
            Processing {amount} {token && token.currency.symbol} to{' '}
            {targetBlockchainConfig && getVernacularBlockchain(targetBlockchainConfig.blockchain)}
          </span>
        </TransactionBarContent>
      </ShinyWrapper>
    </TransactionBarWapper>
  )
}
