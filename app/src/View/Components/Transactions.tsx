import React, { useEffect } from 'react'
import { ShinyHeader, Table } from '@unifiprotocol/uikit'
import { Trans, useTranslation } from 'react-i18next'
import { useTransactions } from '../../Transactions'
import { Hero } from './Styles'
import { useWindow } from '../../Utils/useWindow'
import { TransactionRow } from '../../Components/Transactions/TransactionRow'
import { TransactionMobileRow } from '../../Components/Transactions/TransactionMobileRow'
import { useNavigate } from 'react-router-dom'
import { useAdapter } from '../../Adapter'

export const Transactions = () => {
  const { t } = useTranslation()
  const { swaps } = useTransactions()
  const { adapter } = useAdapter()
  const { windowSize } = useWindow()
  const navigate = useNavigate()

  useEffect(() => {
    if (!adapter?.isConnected()) {
      navigate('swap')
    }
  }, [adapter, navigate])

  return (
    <>
      <Hero>
        <ShinyHeader>{t('bridge.swap.tab.transactions')}</ShinyHeader>
        <p>
          <Trans i18nKey={'bridge.transactions.header'}>
            Track your pending and completed bridge transactions from the last 72 hours. If you are
            experiencing any issues, please contact us for support in our
            <a href="https://discord.gg/qf4Pv65yTG" target="_blank" rel="noreferrer">
              Discord server
            </a>
            <a href="https://unifiprotocol.zendesk.com/hc/en-us" target="_blank" rel="noreferrer">
              Help Center
            </a>
            .
          </Trans>
        </p>
      </Hero>
      <>
        <Table>
          {swaps.map((s, idx) =>
            windowSize.width > 576 ? (
              <TransactionRow tx={s} key={idx} />
            ) : (
              <TransactionMobileRow tx={s} key={idx} />
            )
          )}
        </Table>
      </>
    </>
  )
}
