import { Card, CardBody, CardHeader, SecondaryButton } from '@unifiprotocol/uikit'
import styled from 'styled-components'

export const BridgeWrapper = styled.div`
  max-width: 1051px;
  padding: 2rem;
  display: flex;
  gap: 4rem;
  margin: auto;
  > div {
    width: 50%;
  }

  @media (max-width: 800px) {
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
    > div {
      width: 100%;
    }
  }
`
export const InfoPanel = styled.div``

export const InfoLink = styled(SecondaryButton)``

export const InfoLinks = styled.div`
  display: flex;
  gap: 1rem;
`

export const BridgePanel = styled.div`
  padding-top: 2rem;
  @media (max-width: 600px) {
    ${Card} {
      box-shadow: none;
      background: transparent;
    }
    ${CardBody}, ${CardHeader} {
      padding: 0;
    }
  }
`
