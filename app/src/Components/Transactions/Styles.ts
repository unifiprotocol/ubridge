import { mediaQueries } from '@unifiprotocol/uikit'
import styled from 'styled-components'

export const TransactionRowTitle = styled.div`
  text-transform: uppercase;
  font-size: 0.8rem;
  margin: 0.1rem 0;
  margin-top: 0.5rem;
  opacity: 0.8;
  color: ${(props) => props.theme.primary};
`

export const TransactionsAmountWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;

  ${mediaQueries.xs} {
    justify-content: flex-start;
  }

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
