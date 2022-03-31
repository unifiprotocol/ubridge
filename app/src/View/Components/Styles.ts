import styled from 'styled-components'
import doodle from '../../Assets/doodle.png'

export const BridgePanel = styled.div`
  padding-top: 2rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`

export const Hero = styled.div`
  width: 100%;

  background: url(${doodle}) #191a21;
  background-repeat: no-repeat;
  background-size: 60%;
  background-position: -8rem;

  padding: 0.75rem 1.5rem;
  border-radius: 1rem;
  text-align: justify;

  @media (max-width: 576px) {
    padding: 0;
    max-width: 100%;
    background: none;
  }

  h1 {
    margin: 0.5rem 0;
  }
`

export const LiquidityCardContent = styled.div`
  padding: 0.75rem;

  h1 {
    margin: 0;
    font-size: 1rem;
  }

  .title {
    text-transform: uppercase;
    font-size: 0.8rem;
    margin: 0.1rem 0;
    margin-top: 0.5rem;
    opacity: 0.8;
    color: ${(props) => props.theme.primary};
  }

  .asset {
    display: flex;
    align-items: center;
    padding: 0.2rem 0;

    img {
      height: 24px;
      width: auto;
    }

    > * {
      padding-right: 0.25rem;
    }
  }
`

export const BlockchainTitleWrapper = styled.div`
  display: flex;
  align-items: center;

  > img {
    width: 1.5rem;
    height: auto;
    margin-right: 0.3rem;
    border-radius: 50%;
  }

  > span {
    width: 100%;
  }

  > svg {
    cursor: pointer;
  }
`

export const BridgeWatcherWrapper = styled.div`
  width: 95%;
  margin-top: 1rem;
  display: flex;
  flex-direction: column;

  > h1 {
    margin-bottom: 0rem;
  }

  tr {
    box-shadow: 0 0 33px -22px #00e676;
  }
`
