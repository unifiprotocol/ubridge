import React, { useMemo } from 'react'
import { ShinyHeader, Table } from '@unifiprotocol/uikit'
import { useTranslation } from 'react-i18next'
import { useTransactions } from '../../Transactions'
import { Hero } from './Styles'
import { useWindow } from '../../Utils/useWindow'
import { TransactionRow } from '../../Components/Transactions/TransactionRow'
import { TransactionMobileRow } from '../../Components/Transactions/TransactionMobileRow'

export const Transactions = () => {
  const { t } = useTranslation()
  const { swaps } = useTransactions()
  const { windowSize } = useWindow()

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
