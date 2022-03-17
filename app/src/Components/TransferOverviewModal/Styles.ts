import { Modal } from '@unifiprotocol/uikit'
import styled from 'styled-components'

export const Swap = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`

export const SwapPart = styled.div`
  width: 50%;
  b {
    color: ${(p) => p.theme.primary};
  }
  span {
    display: block;

    margin-bottom: 0.5rem;
  }
  padding: 0.5rem;
  border: 3px solid ${(p) => p.theme.bgAlt2};
  border-radius: ${(p) => p.theme.borderRadius};
`

export const Send = styled(SwapPart)``
export const Receive = styled(SwapPart)``
export const Address = styled.div`
  margin-bottom: 0.5rem;
`
export const Confirm = styled.div`
  margin: 2rem 0 1rem 0;
`

export const TransferOverviewModalWrapper = styled(Modal)`
  max-width: 28rem;
`
export const Desc = styled.div`
  margin-bottom: 2rem;
`

export const TransferActions = styled.div`
  display: flex;
  flex-direction: row;

  > button {
    margin: 0 0.5rem;
  }
`
