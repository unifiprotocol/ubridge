import { Card, CardBody, TokenInput } from '@unifiprotocol/uikit'
import React, { useState } from 'react'
import { BridgeDirection, From, To } from './Styles'
import { CgArrowsExchangeV } from 'react-icons/cg'

export const BridgeForm: React.FC = () => {
  const [amount, setAmount] = useState('0')
  return (
    <Card>
      <CardBody>
        <From>
          <TokenInput
            label="Send"
            balanceLabel="Balance"
            amount={amount}
            onAmountChange={setAmount}
          />
        </From>
        <BridgeDirection>
          <CgArrowsExchangeV size={30} /> <span>Change direction</span>
        </BridgeDirection>
        <To>
          <TokenInput
            label="Receive"
            balanceLabel="Balance"
            amount={amount}
            onAmountChange={setAmount}
          />
        </To>
      </CardBody>
    </Card>
  )
}
