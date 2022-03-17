import {
  Checkbox,
  Modal,
  ModalBody,
  ModalClose,
  ModalHeader,
  ModalProps,
  PrimaryButton,
  TokenAmount
} from '@unifiprotocol/uikit'
import { Currency, shortAddress } from '@unifiprotocol/utils'
import React, { useState } from 'react'
import styled from 'styled-components'
import { useAdapter } from '../../Adapter'
import { useSwap } from '../../Swap'
import { TransactionDetails } from '../BridgeForm/TransactionDetails'

const Swap = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`

const SwapPart = styled.div`
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

const Send = styled(SwapPart)``
const Receive = styled(SwapPart)``
const Address = styled.div`
  margin-bottom: 0.5rem;
`
const Confirm = styled.div`
  margin: 2rem 0 1rem 0;
`

const TransferOverviewModalWrapper = styled(Modal)`
  max-width: 28rem;
`
const Desc = styled.div`
  margin-bottom: 2rem;
`

export interface TransferOverviewModalProps extends ModalProps {}

export const TransferOverviewModal: React.FC<TransferOverviewModalProps> = ({ close }) => {
  const [confirmed, setConfirmed] = useState(false)
  const { targetChain, targetCurrency, destinationAddress, amount } = useSwap()
  const { blockchainConfig, adapter } = useAdapter()

  return (
    <TransferOverviewModalWrapper>
      <ModalHeader>
        <span>Transfer overview</span>
        <ModalClose onClick={close} />
      </ModalHeader>
      <ModalBody>
        <Desc>You are about to confirm the crosschain transaction below: </Desc>
        <Swap>
          <Send>
            <span>
              From <b>{blockchainConfig?.blockchain}</b>
            </span>
            <Address>{shortAddress(adapter?.getAddress() ?? '')}</Address>
            {targetCurrency && <TokenAmount token={targetCurrency} amount={amount} />}
          </Send>

          <Receive>
            <span>
              To <b>{targetChain}</b>
            </span>

            <Address>{shortAddress(destinationAddress)}</Address>
            {targetCurrency && <TokenAmount token={targetCurrency} amount={amount} />}
          </Receive>
        </Swap>
        <TransactionDetails />
        <Confirm>
          <Checkbox
            checked={confirmed}
            onChange={setConfirmed}
            label={
              <>
                I read and accept the <a href="#xd">terms and conditions</a>
              </>
            }
          />
        </Confirm>
        <PrimaryButton disabled={!confirmed} block={true} size="xl">
          Perform swap
        </PrimaryButton>
      </ModalBody>
    </TransferOverviewModalWrapper>
  )
}
