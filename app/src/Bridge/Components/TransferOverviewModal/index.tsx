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
import { shortAddress } from '@unifiprotocol/utils'
import React, { useState } from 'react'
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
              From <b>Binance</b>
            </span>
            <Address>{shortAddress('0x52856Ca4ddb55A1420950857C7882cFC8E02281C')}</Address>
            <TokenAmount token={Config.unfiToken} amount={'100'} />
          </Send>

          <Receive>
            <span>
              To <b>Ethereum</b>
            </span>

            <Address>{shortAddress('0x49506Ca4ddb55A1420950857C7882cFC8E02123A')}</Address>
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
