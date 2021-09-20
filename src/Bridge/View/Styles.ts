import { Card, CardBody, CardHeader, SecondaryButton } from '@unifiprotocol/uikit'
import styled, { keyframes } from 'styled-components'

export const BridgeWrapper = styled.div`
  max-width: 1051px;
  padding: 0 2rem;
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
const kfShine = keyframes`
 to {
      background-position: 200% center;
    }
  `
export const InfoPanel = styled.div`
  position: relative;
  padding-top: 5rem;
  h1 {
    background: ${(p) => p.theme.shinyGradient};
    // red background: linear-gradient(to right, #ff0000 20%, #ff5a00 40%, #ff9a00 60%, #ff5a00 80%);
    background-size: 200% auto;

    background-clip: text;
    text-fill-color: transparent;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;

    animation: ${kfShine} 2s linear infinite;
  }
  p {
    font-size: 115%;
  }
`

export const InfoBackground = styled.div`
  position: absolute;
  z-index: 1;
  opacity: 0.1;
  top: 2rem;
  left: -2rem;
  width: 50%;
  img {
    width: 100%;
  }
`
export const InfoForeground = styled.div`
  position: relative;
  z-index: 2;
`

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
