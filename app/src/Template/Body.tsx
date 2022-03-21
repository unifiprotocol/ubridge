import { ShinyHeader } from '@unifiprotocol/uikit'
import React from 'react'
import styled from 'styled-components'
import { useAdapter } from '../Adapter'
import { useConfig } from '../Config'
import { Hero } from '../View/Components/Styles'

const BodyWrapper = styled.div`
  margin-top: 1rem;
  width: 100vw;
  display: flex;
  justify-content: center;

  @media (max-width: 576px) {
    padding: 0 1.25rem;
  }

  > div {
    max-width: 992px;
  }
`

export const Body: React.FC = ({ children }) => {
  const { connection } = useAdapter()
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
          <p>Working in progress to give you the availability of UNFI crosschain.</p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
            dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
            mollit anim id est laborum.
          </p>
        </Hero>
      </div>
    </BodyWrapper>
  )
}
