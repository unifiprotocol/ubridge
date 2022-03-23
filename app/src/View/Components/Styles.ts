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
    color: rgb(0, 230, 118);
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
  justify-content: space-between;
  align-items: center;

  svg {
    cursor: pointer;
  }
`

export const TransactionsAmountWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;

  > img {
    margin-right: 0.3rem;
    width: 1.5rem;
    height: auto;
  }
`

export const TransactionsLogoWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  > h1 {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  > img {
    margin-right: 0.2rem;
    width: 3rem;
    height: auto;
    border-radius: 50%;
  }
`
