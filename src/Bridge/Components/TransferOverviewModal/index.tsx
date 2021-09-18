import {
  Checkbox,
  Modal,
  ModalBody,
  ModalClose,
  ModalHeader,
  ModalProps,
  ModalTitle,
  PrimaryButton,
  TokenAmount
} from '@unifiprotocol/uikit'
import React, { useState } from 'react'
import { CgArrowsExchangeAlt } from 'react-icons/cg'
import styled from 'styled-components'
import { Config } from '../../../Config'
import { TransactionDetails } from '../BridgeForm/TransactionDetails'

const Swap = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`
const SwapPart = styled.div`
  width: 45%;
  b {
    color: ${(p) => p.theme.primary};
  }
  span {
    display: block;

    margin-bottom: 0.5rem;
  }
`

const Separator = styled.div`
  width: 10%;
  text-align: center;
  padding-top: 2rem;
  color: ${(p) => p.theme.primary};
`
const Send = styled(SwapPart)``
const Receive = styled(SwapPart)``

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
  return (
    <TransferOverviewModalWrapper>
      <ModalHeader>
        <ModalTitle>Transfer overview</ModalTitle>
        <ModalClose onClick={close} />
      </ModalHeader>
      <ModalBody>
        <Desc>You are about to confirm the crosschain transaction below: </Desc>
        <Swap>
          <Send>
            <span>
              Sent from <b>Binance</b>
            </span>

            <TokenAmount token={Config.unfiToken} amount={'100'} />
          </Send>
          <Separator>
            <CgArrowsExchangeAlt size={30} />
          </Separator>
          <Receive>
            <span>
              Received at <b>Ethereum</b>
            </span>

            <TokenAmount token={Config.unfiToken} amount={'99'} />
          </Receive>
        </Swap>
        <TransactionDetails />
        <Confirm>
          <Checkbox
            checked={confirmed}
            onChange={setConfirmed}
            label={
              <>
                I read and accept the <a>terms and conditions</a>
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
