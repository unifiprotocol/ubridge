import styled from 'styled-components'

export const InputHead = styled.div``
export const From = styled.div``
export const To = styled.div``
export const Account = styled.div`
  display: flex;
  align-items: center;
`
export const BridgeDirection = styled.div`
  cursor: pointer;
  padding: 1rem;
  line-height: 0;
  text-align: center;
  color: ${(p) => p.theme.primary};
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    vertical-align: middle;
    margin-right: 0.5rem;
  }
  span {
    transition: 0.25s all;
    text-transform: uppercase;
    font-size: 80%;
    opacity: 0.1;
  }
  &:hover {
    color: ${(p) => p.theme.primaryLight};
    span {
      opacity: 1;
    }
  }
`

export const TransactionDetailsWrapper = styled.div`
  padding: 1rem 0.3rem;
`
