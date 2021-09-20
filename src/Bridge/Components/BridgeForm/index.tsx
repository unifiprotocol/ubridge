import { Card, CardBody, PrimaryButton, TokenInput, useModal } from '@unifiprotocol/uikit'
import React, { useMemo, useState } from 'react'
import { BridgeDirection, From, To, TransactionDetailsWrapper } from './Styles'
import { CgArrowsExchangeV } from 'react-icons/cg'
import { TransactionDetails } from './TransactionDetails'
import { Config } from '../../../Config'
import { TransferOverviewModal, TransferOverviewModalProps } from '../TransferOverviewModal'
import { TransferDirection } from './TransferDirection'

export const BridgeForm: React.FC = () => {
  const [token] = useState(Config.unfiToken)
  const overviewTransactionProps = useMemo(() => ({}), [])
  const [overviewTransaction] = useModal<TransferOverviewModalProps>({
    component: TransferOverviewModal,
    props: overviewTransactionProps,
    options: { disableBackdropClick: true }
  })

  const [amount, setAmount] = useState('0')
  return (
    <>
      <TransferDirection />
      <Card>
        <CardBody>
          <From>
            <TokenInput
              label="Send"
              balanceLabel="Balance"
              amount={amount}
              token={token}
              disableTokenChange={true}
              onAmountChange={setAmount}
            />
          </From>
          <BridgeDirection>
            <CgArrowsExchangeV size={30} /> <span>You will receive</span>
          </BridgeDirection>
          <To>
            <TokenInput
              label="Receive"
              balanceLabel="Balance"
              amount={amount}
              token={token}
              disableTokenChange={true}
              onAmountChange={setAmount}
            />
          </To>
          <TransactionDetailsWrapper>
            <TransactionDetails />
          </TransactionDetailsWrapper>
          <PrimaryButton block={true} size="xl" onClick={overviewTransaction}>
            <CgArrowsExchangeV size={12} /> Transfer ovewview
          </PrimaryButton>
        </CardBody>
      </Card>
    </>
  )
}
