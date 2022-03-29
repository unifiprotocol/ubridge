import React from 'react'
import { ShinyHeader } from '@unifiprotocol/uikit'
import { BridgeForm } from '../../Components/BridgeForm'
import { Hero, BridgePanel } from './Styles'
import { Trans, useTranslation } from 'react-i18next'

export const Swap = () => {
  const { t } = useTranslation()

  return (
    <>
      <Hero>
        <ShinyHeader>{t('bridge.swap.tab.swap')}</ShinyHeader>
        <p>
          <Trans key={'bridge.swap.header'}>
            Bridge your UNFI to and from any of our supported chains! You wil receive native UNFI
            directly into your wallet on the destination blockchain. It's that simple! Explore our
            cross-chain Unifi Protocol ecosystem. For more information on our amazing uBridge, click{' '}
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
    </>
  )
}
