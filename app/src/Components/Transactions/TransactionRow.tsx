import { getBlockchainConfig } from '@unifiprotocol/core-sdk'
import {
  TableRow,
  RowColumn,
  ColumnBody,
  ShinyHeader,
  TokenLogo,
  SecondaryButton
} from '@unifiprotocol/uikit'
import { getVernacularBlockchain } from '@unifiprotocol/utils'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { IoChevronForwardSharp } from 'react-icons/io5'
import { useConfig } from '../../Config'
import { ChainIdBlockchain } from '../../Services/Connectors'
import { SwapTransaction } from '../../Transactions'
import { TransactionsLogoWrapper, TransactionsAmountWrapper } from './Styles'

const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

export const TransactionRow: React.FC<{ tx: SwapTransaction }> = ({ tx }) => {
  const { tokensSupported } = useConfig()
  const { t } = useTranslation()

  const deposit = useMemo(() => tx.transactions.find((t) => t.name === 'Deposit')!, [tx])
  const withdraw = useMemo(() => tx.transactions.find((t) => t.name === 'Withdraw'), [tx])

  const depositBlockchainConfig = useMemo(
    () => getBlockchainConfig(ChainIdBlockchain[Number(deposit.args.originChainId)]),
    [deposit]
  )
  const withdrawBlockchainConfig = useMemo(
    () => getBlockchainConfig(ChainIdBlockchain[Number(deposit.args.targetChainId)]),
    [deposit]
  )

  const status = useMemo(() => {
    return withdraw !== undefined
      ? t('bridge.transactions.row.status.complete')
      : t('bridge.transactions.row.status.pending')
  }, [t, withdraw])

  const timeDifference = useMemo(() => {
    return Math.round((tx.time.valueOf() - Date.now()) / (1000 * 3600))
  }, [tx])

  const token = useMemo(
    () => tokensSupported[deposit.args.originTokenAddress],
    [deposit.args.originTokenAddress, tokensSupported]
  )

  if (!token) return null

  return (
    <TableRow>
      <RowColumn align="right">
        <ColumnBody align="left">
          <TransactionsLogoWrapper>
            <img
              src={depositBlockchainConfig.logoURI}
              alt={depositBlockchainConfig.blockchain}
              title={getVernacularBlockchain(depositBlockchainConfig.blockchain)}
            />
            <ShinyHeader>
              <IoChevronForwardSharp />
            </ShinyHeader>
            <img
              src={withdrawBlockchainConfig.logoURI}
              alt={withdrawBlockchainConfig.blockchain}
              title={getVernacularBlockchain(withdrawBlockchainConfig.blockchain)}
            />
          </TransactionsLogoWrapper>
        </ColumnBody>
      </RowColumn>
      <RowColumn title={t('bridge.transactions.row.status')} align="right">
        <ColumnBody align="right">
          <div>{status}</div>
        </ColumnBody>
      </RowColumn>
      <RowColumn title={t('bridge.transactions.row.amount')} align="right">
        <ColumnBody align="right">
          <TransactionsAmountWrapper>
            <TokenLogo token={{ address: token.currency.address, symbol: token.currency.symbol }} />
            <span>
              {token.currency.toFactorized(deposit.args.amount)} {token.currency.symbol}
            </span>
          </TransactionsAmountWrapper>
        </ColumnBody>
      </RowColumn>
      <RowColumn title={t('bridge.transactions.row.date')} align="right">
        <ColumnBody align="right">
          <div>{rtf.format(timeDifference, 'hours')}</div>
        </ColumnBody>
      </RowColumn>
      <RowColumn align="right">
        <ColumnBody align="right">
          <div style={{ marginBottom: '0.25rem' }}>
            <SecondaryButton
              block={true}
              onClick={() => window.open(depositBlockchainConfig.explorer.tx(deposit.tx_hash))}
            >
              {t('bridge.transactions.row.view_deposit')}
            </SecondaryButton>
          </div>
          {withdraw && (
            <div>
              <SecondaryButton
                block={true}
                onClick={() => window.open(withdrawBlockchainConfig.explorer.tx(withdraw.tx_hash))}
              >
                {t('bridge.transactions.row.view_withdraw')}
              </SecondaryButton>
            </div>
          )}
        </ColumnBody>
      </RowColumn>
    </TableRow>
  )
}
