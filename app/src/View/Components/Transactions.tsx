import React, { useMemo } from 'react'
import {
  ColumnBody,
  IoChevronForwardSharp,
  RowColumn,
  SecondaryButton,
  ShinyHeader,
  Table,
  TableRow,
  TokenLogo
} from '@unifiprotocol/uikit'
import { useTranslation } from 'react-i18next'
import { SwapTransaction, useTransactions } from '../../Transactions'
import { Hero, TransactionsAmountWrapper, TransactionsLogoWrapper } from './Styles'
import { getBlockchainConfig } from '@unifiprotocol/core-sdk'
import { ChainIdBlockchain } from '../../Services/Connectors'
import { useConfig } from '../../Config'
import { getVernacularBlockchain } from '@unifiprotocol/utils'

const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

export const Transactions = () => {
  const { t } = useTranslation()
  const { swaps } = useTransactions()

  return (
    <>
      <Hero>
        <ShinyHeader>{t('bridge.swap.tab.transactions')}</ShinyHeader>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
          sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
          est laborum.
        </p>
      </Hero>
      <>
        <Table>
          {swaps.map((s, idx) => (
            <SwapRow tx={s} key={idx} />
          ))}
        </Table>
      </>
    </>
  )
}

const SwapRow: React.FC<{ tx: SwapTransaction }> = ({ tx }) => {
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

const MobileSwapRow: React.FC<{ tx: SwapTransaction }> = ({ tx }) => {
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
