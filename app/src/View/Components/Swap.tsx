import React from 'react'
import { ShinyHeader, Table } from '@unifiprotocol/uikit'
import { BridgeForm } from '../../Components/BridgeForm'
import { Hero, BridgePanel, BridgeWatcherWrapper } from './Styles'
import { Trans, useTranslation } from 'react-i18next'
import { useTransactions } from '../../Transactions'
import { TransactionRow } from '../../Components/Transactions/TransactionRow'
import { useWindow } from '../../Utils/useWindow'
import { TransactionMobileRow } from '../../Components/Transactions/TransactionMobileRow'

export const Swap = () => {
  const { t } = useTranslation()
  const { currentTransaction } = useTransactions()
  const { windowSize } = useWindow()

  return (
    <>
      <Hero>
        <ShinyHeader>{t('bridge.swap.tab.swap')}</ShinyHeader>
        <p>
          <Trans i18nKey={'bridge.swap.header'}>
            Bridge your UNIFI to and from any of our supported chains! You wil receive native UNIFI
            directly into your wallet on the destination blockchain. It's that simple! Explore our
            cross-chain Unifi Protocol ecosystem. For more information on our amazing uBridge, click
            <a href="http://twitter.com/unifiprotocol" target="_blank" rel="noreferrer">
              HERE
            </a>
            .
          </Trans>
        </p>
      </Hero>
      <BridgePanel>
        <BridgeForm />
      </BridgePanel>
      {currentTransaction && (
        <BridgeWatcherWrapper>
          <ShinyHeader>{t('bridge.swap.swap_watcher')}</ShinyHeader>
          <Table>
            {windowSize.width > 576 ? (
              <TransactionRow tx={currentTransaction} />
            ) : (
              <TransactionMobileRow tx={currentTransaction} />
            )}
          </Table>
        </BridgeWatcherWrapper>
      )}
    </>
  )
}
