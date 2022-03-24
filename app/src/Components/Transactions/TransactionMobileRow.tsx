import { getBlockchainConfig } from '@unifiprotocol/core-sdk'
import { CollapsibleCard, ShinyHeader, TokenLogo, SecondaryButton } from '@unifiprotocol/uikit'
import { getVernacularBlockchain } from '@unifiprotocol/utils'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { IoChevronForwardSharp } from 'react-icons/io5'
import { useConfig } from '../../Config'
import { ChainIdBlockchain } from '../../Services/Connectors'
import { SwapTransaction } from '../../Transactions'
import { TransactionRowTitle, TransactionsAmountWrapper, TransactionsLogoWrapper } from './Styles'

const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

export const TransactionMobileRow: React.FC<{ tx: SwapTransaction }> = ({ tx }) => {
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
    <CollapsibleCard>
      <div>
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
      </div>

      <div>
        <TransactionRowTitle>{t('bridge.transactions.row.status')}</TransactionRowTitle>
        <div>{status}</div>
      </div>

      <div>
        <TransactionRowTitle>{t('bridge.transactions.row.amount')}</TransactionRowTitle>
        <TransactionsAmountWrapper>
          <TokenLogo token={{ address: token.currency.address, symbol: token.currency.symbol }} />
          <span>
            {token.currency.toFactorized(deposit.args.amount)} {token.currency.symbol}
          </span>
        </TransactionsAmountWrapper>
      </div>

      <div>
        <TransactionRowTitle>{t('bridge.transactions.row.date')}</TransactionRowTitle>
        <div>{rtf.format(timeDifference, 'hours')}</div>
      </div>

      <div>
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
      </div>
    </CollapsibleCard>
  )
}
