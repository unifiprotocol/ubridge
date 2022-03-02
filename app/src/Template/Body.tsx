import React from 'react'
import styled from 'styled-components'
import { useAdapter } from '../Adapter'
import { useConfig } from '../Config'

const BodyWrapper = styled.div`
  margin-top: 1rem;
  width: 100vw;
  display: flex;
  justify-content: center;
`

export const Body: React.FC = ({ children }) => {
  const { connection } = useAdapter()
  const { config } = useConfig()

  if (connection && config[connection.config.blockchain]) {
    return <BodyWrapper>{children}</BodyWrapper>
  }

  return <h1>Blockchain not supported</h1>
}
