import { BiHelpCircle, Tooltip } from '@unifiprotocol/uikit'
import { BN } from '@unifiprotocol/utils'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { useAdapter } from '../../Adapter'
import { useSwap } from '../../Swap'
import { tooltipStyles } from './Styles'

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
  const { t } = useTranslation()
  const { maxSwapSize, targetCurrency, fees, targetChain } = useSwap()
  const { blockchainConfig } = useAdapter()

  const targetFee = useMemo(() => {
    let fee = '0'
    if (targetChain && blockchainConfig && fees[targetChain]) {
      fee = blockchainConfig.nativeToken.toFactorized(fees[targetChain] || '0')
    }
    return `${fee} ${blockchainConfig?.nativeToken.symbol}`
  }, [blockchainConfig, fees, targetChain])

  return targetCurrency ? (
    <TransactionDetailsWrapper>
      <Line>
        <Title>{t('bridge.common.max_swap_size')}</Title>
        <Value>
          {BN(maxSwapSize).dp(4).toFixed()} {targetCurrency.symbol}
        </Value>
      </Line>
      <Line>
        <Title>{t('bridge.common.swap_fee')}</Title>
        <Value>{targetFee}</Value>
      </Line>
      <Line>
        <Title>
          <span>{t('bridge.common.estimated_time')} </span>
          <Tooltip
            styles={tooltipStyles}
            content={<span>{t('bridge.common.estimated_time.tooltip')}</span>}
          >
            <BiHelpCircle />
          </Tooltip>
        </Title>
        <Value>~2min</Value>
      </Line>
    </TransactionDetailsWrapper>
  ) : null
}
