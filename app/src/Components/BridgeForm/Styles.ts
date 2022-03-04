import { PrimaryButton } from '@unifiprotocol/uikit'
import styled from 'styled-components'

export const InputHead = styled.div``
export const From = styled.div``
export const To = styled.div``
export const Account = styled.div`
  display: flex;
  align-items: center;
`
export const BridgeDirection = styled.div`
  padding: 0.75rem;
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

export const TransferOverviewButton = styled(PrimaryButton)`
  font-weight: bold;
  font-size: 110%;
`

export const DestinationAddressWrapper = styled.div`
  cursor: pointer;
  margin-top: 0.5rem;

  :focus-within,
  :hover {
    color: ${(props) => props.theme.primary};
  }

  input {
    font-size: 0.95rem;
  }
`

export const DestinationLabel = styled.div`
  text-align: center;
  font-size: 0.85rem;
`

export const BlockchainFlow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0.3rem;
  margin-bottom: 0.5rem;
`
