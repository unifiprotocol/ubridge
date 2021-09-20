import styled from 'styled-components'

export const InputHead = styled.div``
export const From = styled.div``
export const To = styled.div``
export const Account = styled.div`
  display: flex;
  align-items: center;
`
export const BridgeDirection = styled.div`
  padding: 0.3rem;
  line-height: 0;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 90%;
  color: ${(p) => p.theme.txt200};
  svg {
    vertical-align: middle;
    margin-right: 0.3rem;
  }
`

export const TransactionDetailsWrapper = styled.div`
  padding: 1rem 0.3rem;
`
