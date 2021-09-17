import { SecondaryButton } from '@unifiprotocol/uikit'
import styled from 'styled-components'

export const BridgeWrapper = styled.div`
  padding-top: 2rem;
  max-width: 1051px;
  display: flex;
  gap: 1rem;
  margin: auto;
  > div {
    width: 50%;
  }
`
export const InfoPanel = styled.div``

export const InfoLink = styled(SecondaryButton)``

export const InfoLinks = styled.div`
  ${InfoLink} {
    display: block;
  }
`

export const BridgePanel = styled.div`
  padding-top: 2rem;
`
