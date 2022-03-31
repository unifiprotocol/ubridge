import { ShinyHeader } from '@unifiprotocol/uikit'
import { getVernacularBlockchain } from '@unifiprotocol/utils'
import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { useAdapter } from '../Adapter'
import { useConfig } from '../Config'
import { Hero } from '../View/Components/Styles'

const BodyWrapper = styled.div`
  margin-top: 1rem;
  width: 100vw;
  display: flex;
  justify-content: center;
  position: relative;

  @media (max-width: 576px) {
    padding: 0 1.25rem;
  }

  > div {
    max-width: 992px;
  }
`

export const Body: React.FC = ({ children }) => {
  const { t } = useTranslation()
  const { connection, blockchainConfig } = useAdapter()
  const { config } = useConfig()

  if (connection && config[connection.config.blockchain]) {
    return (
      <BodyWrapper>
        <div>{children}</div>
      </BodyWrapper>
    )
  }

  return (
    <BodyWrapper>
      <div>
        <Hero>
          <ShinyHeader>Blockchain not supported</ShinyHeader>
          <p>
            {t('bridge.common.blockchain_unavailable', {
              blockchain: blockchainConfig?.blockchain
                ? getVernacularBlockchain(blockchainConfig.blockchain)
                : 'X'
            })}
          </p>
        </Hero>
      </div>
    </BodyWrapper>
  )
}
