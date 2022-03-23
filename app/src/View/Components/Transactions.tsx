import React, { useMemo } from 'react'
import {
  ColumnBody,
  RowColumn,
  SecondaryButton,
  ShinyHeader,
  Table,
  TableRow,
  TokenLogo
} from '@unifiprotocol/uikit'
import { useTranslation } from 'react-i18next'
import { SwapTransaction, useTransactions } from '../../Transactions'
import { Hero, TransactionsAmountWrapper } from './Styles'
import { getBlockchainConfig } from '@unifiprotocol/core-sdk'
import { ChainIdBlockchain } from '../../Services/Connectors'
import { useConfig } from '../../Config'

const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

export const Transactions = () => {
  const { t } = useTranslation()
  const { swaps } = useTransactions()

  return (
    <>
      <Hero>
        <ShinyHeader>{t('bridge.swap.tab.transaction')}</ShinyHeader>
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
  const deposit = useMemo(() => tx.transactions.find((t) => t.name === 'Deposit')!, [tx])
  const withdraw = useMemo(() => tx.transactions.find((t) => t.name === 'Withdraw'), [tx])
  const { tokensSupported } = useConfig()

  const depositBlockchainConfig = useMemo(
    () => getBlockchainConfig(ChainIdBlockchain[Number(deposit.args.originChainId)]),
    [deposit]
  )
  const withdrawBlockchainConfig = useMemo(
    () => getBlockchainConfig(ChainIdBlockchain[Number(deposit.args.targetChainId)]),
    [deposit]
  )

  const status = useMemo(() => {
    return withdraw !== undefined ? 'COMPLETE' : 'PENDING'
  }, [withdraw])

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
          <div>
            {depositBlockchainConfig.blockchain} - {withdrawBlockchainConfig?.blockchain}
          </div>
        </ColumnBody>
      </RowColumn>
      <RowColumn title={`STATUS`} align="right">
        <ColumnBody align="right">
          <div>{status}</div>
        </ColumnBody>
      </RowColumn>
      <RowColumn title={`AMOUNT`} align="right">
        <ColumnBody align="right">
          <TransactionsAmountWrapper>
            <TokenLogo token={{ address: token.currency.address, symbol: token.currency.symbol }} />
            <span>
              {token.currency.toFactorized(deposit.args.amount)} {token.currency.symbol}
            </span>
          </TransactionsAmountWrapper>
        </ColumnBody>
      </RowColumn>
      <RowColumn title={`DATE`} align="right">
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
              View Deposit
            </SecondaryButton>
          </div>
          {withdraw && (
            <div>
              <SecondaryButton
                block={true}
                onClick={() => window.open(withdrawBlockchainConfig.explorer.tx(withdraw.tx_hash))}
              >
                View Withdraw
              </SecondaryButton>
            </div>
          )}
        </ColumnBody>
      </RowColumn>
    </TableRow>
  )
}
