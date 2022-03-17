import React, { useMemo } from 'react'
import styled from 'styled-components'
import { useAdapter } from '../../Adapter'
import { offlineConnectors } from '../../Services/Connectors'
import { useSwap } from '../../Swap'

const TransactionDetailsWrapper = styled.ul`
  padding: 0;
  margin: 0;
`

const Line = styled.li`
  padding: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Title = styled.div`
  color: ${(p) => p.theme.txt200};
`

const Value = styled.div``

export const TransactionDetails: React.FC = () => {
  const { maxSwapSize, targetCurrency, fees, targetChain } = useSwap()
  const { blockchainConfig } = useAdapter()

  const targetFee = useMemo(() => {
    if (!targetChain || !blockchainConfig || !fees[targetChain]) return undefined
    const fee = blockchainConfig.nativeToken.toFactorized(fees[targetChain] || '0')
    return `${fee} ${blockchainConfig.nativeToken.symbol}`
  }, [blockchainConfig, fees, targetChain])

  return targetCurrency ? (
    <TransactionDetailsWrapper>
      <Line>
        <Title>Max swap size</Title>
        <Value>
          {maxSwapSize} {targetCurrency.symbol}
        </Value>
      </Line>
      <Line>
        <Title>Swap fee</Title>
        <Value>{targetFee}</Value>
      </Line>
      <Line>
        <Title>Estimated time</Title>
        <Value>~2min</Value>
      </Line>
    </TransactionDetailsWrapper>
  ) : null
}
