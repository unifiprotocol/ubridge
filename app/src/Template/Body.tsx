import React from 'react'
import styled from 'styled-components'

const BodyWrapper = styled.div`
  margin-top: 1rem;
  width: 100vw;
  display: flex;
  justify-content: center;
`

export const Body: React.FC = ({ children }) => {
  return <BodyWrapper>{children}</BodyWrapper>
}
